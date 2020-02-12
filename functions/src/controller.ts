// 3rd-Party modules
const functions = require('firebase-functions');
const express = require('express');
const app = express();
// Http request node module to make
const http = require('axios').default;
// - need to use res.data to access the response information

import { CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader, sampleObj } from "./variables";
import { Beer, getCustomDefinition, getCustomsJson, fieldType } from "./model";





// @ts-ignore
app.get('/timestamp', (request, response) => {
    response.send(`test`);
});
// @ts-ignore
app.get('/cd-taps', (request, response) => {
    response.set('Cache-Control', 'public, max-age=5, s-maxage=5');
    // response.json(sampleObj);
    getData(CD).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
    // response.json(`CD-Taps`);
    // response.render('index');
});
// @ts-ignore
app.get('/gw-taps', (request, response) => {
    response.set('Cache-Control', 'no-cache, no-store');//'public, max-age=5, s-maxage=5');
    // response.json(sampleObj);
    getData(GW).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
    // response.json(`CD-Taps`);
    // response.render('index');
});









////////////////////////////////////////////////////////////////////////////

// put variables here?


let customDef = {};

// async works!
async function getData (shop: any) {
    // getUrl to be modified to support limited cards? or just filter deck after...
    let getUrl = (listId: string) => `https://api.trello.com/1/lists/${listId}/cards/?customFieldItems=true&key=${key}&token=${token}`;
    // Use axios to synchronously get JSON from apropriate list using async/await
    let listJson = await http.get(getUrl(shop.list)).then((res: any) => res.data).catch((err: Error) => console.error(err));
    
    // Asynchronously retrieves list data from Trello
    // let listJson = await getListJson(shop.list);
    
    let url = `https://api.trello.com/1/boards/${shop.board}/customFields?key=${key}&token=${token}`;
    customDef = await http.get(url).then((resp: any) => getCustomDefinition(resp.data)).catch((err: Error) => err);

    // customDef = await http.get(url).then(getCustomDefinition).catch((err: Error) => err);
    // customDef = await getCustomsJson(shop.board).then(getCustomDefinition).catch(err => err);
    

    //getCustomsJson.then(getCustomDefinition);

    // let cards = makeCards(listJson);
    // Initiate customs based on shop location
    // customs(shop);
    // Creates an array of Beer objects 
    // @ts-ignore
    let cards = listJson.map((card: any, index: number) => new (Beer as any)(card, customDef, index));
    console.log("cards: ", cards);
    
    console.log("get to me last");
// return cards
    // $.get("/cd-taps").then((res: any) => console.log(`Then me: ${res.data}`));

    // console.log(`Then Print Me: ${$.get("/cd-taps")}`);
    
    return cards;
}
// getData(GW);
// console.log(listJson(GW.list));



//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\








// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);