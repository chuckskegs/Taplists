// Firebase to create http callable endpoint
import * as functions from 'firebase-functions';
// Http request-receiving protocol for routing
import express from 'express';
const app = express();

// My imports
import { getData } from "./model";
import updateSquare from './square';
import { GW, CD } from './variables';



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
    let query = request.query; 
    // let myShop = query.menu.startsWith('GW') ? GW : CD;
    //@ts-ignore
    query.menu = GW | CD;
    // let itemArrays = [ GW.ids, CD.ids];
    // let queryArray = ["GW1", "CD1"];

    // Get data for each menu and add to database, then update square with this information
    // @params include the query for the data set and the shop it applies to
    // @todo simplify to one call that gets all data for a shop
    const dataPromise = (dataSet: string, shop: object) => {
        getData(dataSet).then((cards) => {
            updateSquare(cards, shop).then((resp) => response.send(resp)).catch(err => console.error(err));
        }).catch(err => console.log(err));
        dataPromise.length;
    }

    dataPromise("CD3", CD);
    // Run them
    // // Needs helper function
    // let fullArray: any[] = [];
    // const allData = Promise.all([getData("CD").then(helper), getData("CD3").then(helper)]).then(res => fullArray.concat(...res)).catch(console.error);
    // // @ts-ignore
    // allData.then((allCards: object[]) => {
    //     console.log(allCards);
        
    //     updateSquare(allCards, CD).then(res => response.send(res)).catch(console.error);
    // }).catch(console.error);
    
    
    // dataPromise("CD", CD);
    // getData("CD3").then((cards) => {
        //     updateSquare(cards, CD).then((resp) => response.send(resp)).catch(err => console.error(err));
        // }).catch(err => console.log(err));
    
});


// // Currently need a helper function to add the Square ITEM's variation property to the objects
// const helper = (dataResponse) => {

//     return dataResponse;
// }









// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);

