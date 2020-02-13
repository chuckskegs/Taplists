// 3rd-Party modules
// const functions = require('firebase-functions');
import * as functions from 'firebase-functions';
// const express = require('express');
import express from 'express';
const app = express();
// Http request node module to make
// const http = require('axios').default;
import http, { AxiosResponse, AxiosError } from 'axios';
// - need to use res.data to access the response information

import { CD, GW, key, token } from "./variables";
import { Beer, getCustomDefinition } from "./model";

app.get('/timestamp', (_request: express.Request, response: express.Response) => {
    response.send(`test`);
});
// app.get('/cd1', (request: express.Request, response: express.Response) => {
//     response.set('Cache-Control', 'no-cache, no-store');
//     getData(CD).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
// });
// app.get('/gw1', (request: express.Request, response: express.Response) => {
//     response.set('Cache-Control', 'no-cache, no-store');//'public, max-age=5, s-maxage=5');
//     getData(GW).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
// });

// Manages *./app/data endpoint
// Uses query info from request to determine which data to return
app.get('/data', (request: express.Request, response: express.Response) => {
    response.set('Cache-Control', 'no-cache, no-store');//'public, max-age=5, s-maxage=5');
    // response.send(request.query);
    let query = request.query;
    // let shop: any = CD;
    let startRange: number = 0;
    // Assesses the query parameters from request and uses button id determine data to use
    // switch (request.query.list) {
    //     case `CD1`:
    //         shop = CD;
    //         startRange = 1;
    //         break;
    //     case `CD2`:
    //         shop = CD;
    //         startRange = 26;
    //         break;
    //     case `CD3`:
    //         shop = CD;
    //         startRange = 51;
    //         break;
    //     case `CD4`:
    //         shop = CD;
    //         startRange = 5;
    //         break;
    //     case `GW1`:
    //         shop = GW;
    //         startRange = 1;
    //         // getData(GW).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
    //         break;
    //     case `GW2`:
    //         shop = GW;
    //         startRange = 26;
    //         break;
    //     default:
    //         break;
    // }
    // Requests data using the query received from client side
    
    // Get menu data using query properties and provide response in JSON
    getData(query.menu)
        .then((cards) => {
            
            response.json(cards);
        }).catch((err) => response.send(`Error: ${err}`));
    let test  = startRange;
    startRange = test; 
    // getData(GW).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
});


////////////////////////////////////////////////////////////////////////////

// put variables here?



// async works!
// Returns current taplist data based on shop parameter requested
async function getData (menu: string) {
    // Identifies shop and list to display from the menu query parameter
    // Checks if starts with GW such as GW1, GW2, etc. and set's shop value accordingly
    let shop = menu.startsWith('GW') ? GW : CD;
    let list = shop.list;
    

    ////// Filter for Screen \\\\\\
    // Use redux to extract number from query
    // let list = menu.replace( /^\D+/g, '');
    let screen: number = parseInt(menu.charAt(2));
    let start;
    let end;

    // Reduce Deck size based on screen to be displayed
    // Hopefully could be replaced with a CSS option
    switch (screen) {
        case 1:
            // start = 0;
            end = 25;
            break;
        case 2:
            start = 25;
            // end = 50;
            break;
        case 3:
            // start = 0;
            list = shop.list2;         
            break;    
        default:
            // Use all the cards for mobile (hint: because button id doesn't have number associated)
            break;
    }

    // ...getUrl to be modified to support limited cards? or just filter deck after...
    let getUrl = (listId: string) => `https://api.trello.com/1/lists/${listId}/cards/?customFieldItems=true&key=${key}&token=${token}`;
    // Use axios to synchronously get JSON from apropriate list using async/await
    let jsonDeck: Array<JSON> = await http.get(getUrl(list)).then((res: AxiosResponse) => res.data).catch((err: AxiosError) => console.error(err.message));
    
    // Synchronously retrieves list data from Trello
    let url = () => `https://api.trello.com/1/boards/${shop.board}/customFields?key=${key}&token=${token}`;
    let customDef = await http.get(url()).then((res: AxiosResponse) => getCustomDefinition(res.data)).catch((err: AxiosError) => err.message);
    
    
    
    // Creates an array of Beer objects 
    // Looks at each card from Trello and creates Beer objects using the definitions made
    let cards = jsonDeck.map((card: any, index: number) => new (Beer as any)(card, customDef, index));
    


    // ////// Filter for Screen \\\\\\
    // // Use redux to extract number from query
    // // let list = menu.replace( /^\D+/g, '');
    // let screen: number = parseInt(menu.charAt(2));

    // // Reduce Deck size based on screen to be displayed
    // // Could be replaced with a CSS option
    cards = cards.slice(start, end);
    

    // console.log("Cards: ", cards);
    // console.log("Get to me last?");
    return cards;
}




//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




 



// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);