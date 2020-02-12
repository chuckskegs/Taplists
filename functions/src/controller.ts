// 3rd-Party modules
const functions = require('firebase-functions');
// const express = require('express');
import * as express from 'express';
const app = express();
// Http request node module to make
// const http = require('axios').default;
import http from 'axios';
// - need to use res.data to access the response information

import { CD, GW, key, token } from "./variables";
import { Beer, getCustomDefinition } from "./model";




app.get('/timestamp', (request: express.Request, response: express.Response) => {
    response.send(`test`);
});
// @ts-ignore
app.get('/cd-taps', (request, response) => {
    response.set('Cache-Control', 'public, max-age=5, s-maxage=5');
    getData(CD).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
});
// @ts-ignore
app.get('/gw-taps', (request, response) => {
    response.set('Cache-Control', 'no-cache, no-store');//'public, max-age=5, s-maxage=5');
    getData(GW).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
});


////////////////////////////////////////////////////////////////////////////

// put variables here?



// async works!
// Returns current taplist data based on shop parameter requested
async function getData (shop: any) {
    // getUrl to be modified to support limited cards? or just filter deck after...
    let getUrl = (listId: string) => `https://api.trello.com/1/lists/${listId}/cards/?customFieldItems=true&key=${key}&token=${token}`;
    // Use axios to synchronously get JSON from apropriate list using async/await
    let listJson = await http.get(getUrl(shop.list)).then((res: any) => res.data).catch((err: Error) => console.error(err));
    
    // Synchronously retrieves list data from Trello
    let url = `https://api.trello.com/1/boards/${shop.board}/customFields?key=${key}&token=${token}`;
    let customDef = await http.get(url).then((resp: any) => getCustomDefinition(resp.data)).catch((err: Error) => err);

    // Creates an array of Beer objects 
    let cards = listJson.map((card: any, index: number) => new (Beer as any)(card, customDef, index));
    
    // console.log("Cards: ", cards);
    // console.log("Get to me last?");
    return cards;
}




//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




 



// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);