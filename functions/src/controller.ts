// 3rd-Party modules
const functions = require('firebase-functions');
const express = require('express');
const app = express();
// Http request node module to make
const http = require('request-promise');
require('jquery');
// const $ = jQuery();
// import * as $ from "jquery";
// My Modules
import { CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader, sampleObj } from "./variables";
import { Beer, getCustomDefinition, getCustomsJson, fieldType } from "./model";






// @ts-ignore
app.get('/timestamp', (request, response) => {
    response.send(`test`);
});
// @ts-ignore
app.get('/timestamp-caced', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
    // response.render('index');
});
// @ts-ignore
app.get('/cd-taps', (request, response) => {

    getData(CD).then((res) => response.json(res)).catch((err) => response.send(`Error: ${err}`));
    // response.json(`CD-Taps`);
    // response.render('index');
});
// @ts-ignore
app.get('/test', (request, response) => {
    
    const url = `https://api.trello.com/1/lists/5592b25a535fb4a14dea3bbf/cards/?customFieldItems=true&key=a211f4aca7fb3e521d652730dd231cb6&token=ae6ebe60b45abcd2d4aa945c9ab4c4571bd6b6f7856b1df0cd387fbffc649579`;
    response.send($.get(url))
    $.get(url).then((res: any) => response.serve(res));
    let callback = (resp: any) => {
        let testing = resp.toString();
        response.send(`hi ${(testing)}`);
        resp.on('data', (d: any) => {
            process.stdout.write(d);

        })
    }
    http.get(url);
    // const getListJson = (list: string) =>
    // $.getJSON(url).then((res: any) => response.json(res)).catch((err: any) => err);



    // getData(CD).then((res) => response.json(res)).catch((err) => err);
    
    // response.json(getData("hello").then);
    // response.render('index');
});




// Constructs URL string for http request for card info
const getUrl = (listId: string) => `https://api.trello.com/1/lists/5592b25a535fb4a14dea3bbf/cards/?customFieldItems=true&key=a211f4aca7fb3e521d652730dd231cb6&token=ae6ebe60b45abcd2d4aa945c9ab4c4571bd6b6f7856b1df0cd387fbffc649579`;
const getListJson = (list: string) =>
    $.getJSON(getUrl(list)).then((res: any) => res).catch((err: any) => err);




////////////////////////////////////////////////////////////////////////////

// put variables here?


let customDef = {};

// async works!
async function getData (shop: any) {
    // return sampleObj;
    // Asynchronously retrieves list data from Trello
    let listJson = await getListJson(shop.list);
    
    return listJson;
    customDef = await getCustomsJson(shop.board).then(getCustomDefinition).catch(err => err);
    
    //getCustomsJson.then(getCustomDefinition);

    // let cards = makeCards(listJson);
    // Initiate customs based on shop location
    // customs(shop);
    // Creates an array of Beer objects 
    // @ts-ignore
    let cards = listJson.map((card: any, index: number) => new (Beer as any)(card, index));
    console.log("cards: ", cards);
    
    console.log("get to me last");

    $.get("/cd-taps").then((res: any) => console.log(`Then me: ${res}`));

    // console.log(`Then Print Me: ${$.get("/cd-taps")}`);
    
    return cards;
}
// getData(GW);
// console.log(listJson(GW.list));



//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\








// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);