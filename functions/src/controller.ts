// Firebase to create http callable endpoint
import * as functions from 'firebase-functions';
// Http request-receiving protocol for routing
import express from 'express';
const app = express();


// My imports
import { getData } from "./model";
import { updateSquare, helper, squareTest } from './square';
import { GW, CD } from './variables';


/**
 * Manages data requests: *./app/data
 * Uses query info from request to determine which data to return
 * @todo extract query data to only apply to Controller.ts
 */
app.all('/data', (request: express.Request, response: express.Response) => {
    let menu = request.query.menu;
    if (request.method === "GET" && !request.query) { 
        menu = "GW";
    }
    // let shop = query.menu.startsWith('GW') ? GW : CD;

    // Requests data using the query received from client side
    // Get menu data using query properties and provide response in JSON
    getData(menu)
        .then((cards) => {
            
            response.json(cards);
        }).catch((err) => response.send(`Error: ${err}`));
});


////////////////////////////////////////////////////////////////////////////


let webResponse: string[] = ["This is the batch upsert response from Square"];


/**
 * Square Update Webhook
 * Intended to retrieve data and update Square with information
 * @todo switch from "get" to "post" for Webhook trigger
 * @todo link to database
 */
// let updateAll = (request: express.Request, response: express.Response) => {
    // response.
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
    console.log("starting update...");
    let shop = queries[0].startsWith('GW') ? GW : CD;
    let fullArray: any[] = [];
    const allData = Promise.all([getData(queries[0]), getData(queries[1])]).then(res => fullArray.concat(...res)).catch(console.error);
    let ids = shop.ids;
    // uses data that has been merged into one array with each card storing it's own version number
    return allData.then((res: any) => helper(res, ids)).then((allCards: object[]) => {
        console.log("retrieved data...");
        updateSquare(allCards, shop)
        .then(res => { 
            console.log(`square response (${shop.name}):`, res); 
            webResponse.push(JSON.stringify(res));
            return res })
        .catch(err => console.log("error log: ", err));
        console.log("square called...");
    }).catch((err) => { console.log("err: ", err); return err }); //response.send(`${err}`)});
}


    // setTimeout(() => {
    // }, 10000);
    // dataPromise("CD", CD);
    // getData("CD3").then((cards) => {
        //     updateSquare(cards, CD).then((resp) => response.send(resp)).catch(err => console.error(err));
        // }).catch(err => console.log(err));
        
    
    
// };

app.all('/update', (request: express.Request, response: express.Response) => {
    
    let combinedResponse = ["Empty Array for Empty Update"];
    
    // Store responses to render?
    // combinedResponse.push(runUpdate(["CD", "CD3"]));
    // combinedResponse.push(runUpdate(["GW", "GW3"]));
    // combinedResponse.push(webResponse);

    
    response.status(200).send(combinedResponse);

    console.log("End of Code Reached");
});


app.get('/test', (request: express.Request, response: express.Response) => {
    console.log("starting");

    // if (false) {deleteItems().then(res => response.send(res)).catch(res => response.send(res))};
    squareTest().then(res => response.send(res)).catch(res => response.send(res));

    console.log("finished");
});



// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);


exports.scheduledUpdate = functions.pubsub.schedule('* * * * *').onRun((context) => {
    console.log('This will be run every 1 minute!');
    
    // let combinedResponse = [];
    
    runUpdate(["CD", "CD3"]).catch(res => console.log(`Response CD: ${res}`));
    runUpdate(["GW", "GW3"]).catch(res => console.log(`Response GW: ${res}`));
    

    

    return null;
});