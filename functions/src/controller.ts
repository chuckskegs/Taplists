// Firebase to create http callable endpoint
import * as functions from 'firebase-functions';
// Http request-receiving protocol for routing
import express from 'express';
const app = express();

// My imports
import { getData } from "./model";
import { updateSquare, helper } from './square';
import { GW, CD, square } from './variables';


/**
 * Manages data requests: *./app/data
 * Uses query info from request to determine which data to return
 * @todo extract query data to only apply to Controller.ts
 */
app.get('/data', (request: express.Request, response: express.Response) => {
    response.set('Cache-Control', 'no-cache, no-store');//'public, max-age=5, s-maxage=5');
    let query = request.query;
    // let shop = query.menu.startsWith('GW') ? GW : CD;

    // Requests data using the query received from client side
    // Get menu data using query properties and provide response in JSON
    getData(query.menu)
        .then((cards) => {
            
            response.json(cards);
        }).catch((err) => response.send(`Error: ${err}`));
});


////////////////////////////////////////////////////////////////////////////

/**
 * Square Update Webhook
 * Intended to retrieve data and update Square with information
 * @todo switch from "get" to "post" for Webhook trigger
 * @todo link to database
 */
app.get('/update', (request: express.Request, response: express.Response) => {
    // let query = request.query; 
    // // let myShop = query.menu.startsWith('GW') ? GW : CD;
    // //@ts-ignore
    // query.menu = GW | CD;
    // let itemArrays = [ GW.ids, CD.ids];
    // let queryArray = ["GW1", "CD1"];

    // Get data for each menu and add to database, then update square with this information
    // @params include the query for the data set and the shop it applies to
    // @todo simplify to one call that gets all data for a shop
    // const dataPromise = (dataSet: string, shop: Shop) => {
    //     getData(dataSet).then((cards) => {
    //         updateSquare(cards, shop).then((resp) => response.send(resp)).catch(err => console.error(err));
    //     }).catch(err => console.log(err));
    //     dataPromise.length;
    // }


    // Primary Update
    // Uses queries strings to get data from Trello then update Square
    // Current design supports actions for a single shop at a time 
    const runUpdate = (queries: string[]) => {    
        let shop = queries[0].startsWith('GW') ? GW : CD;
        let fullArray: any[] = [];
        const allData = Promise.all([getData(queries[0]), getData(queries[1])]).then(res => fullArray.concat(...res)).catch(console.error);
        let ids = square.testIds;
        // uses data that has been merged into one array with each card storing it's own version number
        allData.then((res: any) => helper(res, ids)).then((allCards: object[]) => {
            updateSquare(allCards, shop).then(res => res).catch(console.error);
        }).catch((err) => {console.error(err); response.send(`${err}`)});
    }
    runUpdate(["CD", "CD3"]);
    
    
    setTimeout(() => {
        runUpdate(["GW", "GW3"]);
    }, 10000);

    console.log("Api Update Finished");
    response.send("Api Update Finished");
    
    // dataPromise("CD", CD);
    // getData("CD3").then((cards) => {
        //     updateSquare(cards, CD).then((resp) => response.send(resp)).catch(err => console.error(err));
        // }).catch(err => console.log(err));
    
});





// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);

