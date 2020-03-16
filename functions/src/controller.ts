// Firebase to create http callable endpoint
import * as functions from 'firebase-functions';

// Http request-receiving protocol for routing
import express from 'express';
const app = express();

// My imports
import { getData } from "./model";
import { updateSquare, helper, squareTest } from './square';
import { GW, CD, Shop } from './variables';
import { BatchUpsertCatalogObjectsResponse } from 'square-connect';


/**
 * Manages data requests: *./app/data
 * Uses query info from request to determine which data to return
 * @todo extract query data to only apply to Controller.ts
 */
app.all('/data', (request: express.Request, response: express.Response) => {
    let menu = request.query.menu;
    // If no query provided
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
let webResponse: string[] = ["This array stores http responses when possible"];

// for retries.
const fullUpdate = () => {
    runUpdate(["CD", "CD3"]).catch(res => console.log("Error with CD update."));
    runUpdate(["GW", "GW3"]).catch(res => console.log("Error with GW update."));
}
// for retries.
const singleUpdate = (shop: Shop) => {
    if (shop.name === "GW") { 
        runUpdate(["GW", "GW3"]).catch(res => console.log("Error with GW update."));
    } else {
        runUpdate(["CD", "CD3"]).catch(res => console.log("Error with CD update."));
    }
}

/**
 * Square Update
 * Intended to retrieve data from Trello and update Square with information
 * Uses queries strings to get data from Trello then update Square
 * Supports actions for a single shop at a time 
 * @params query determines data set and the shop it applies to
 */
const runUpdate = (queries: string[]) => { 
    console.log(`${queries[0]}: starting update...`);
    
    let shop = queries[0].startsWith('GW') ? GW : CD;
    let fullArray: any[] = [];
    const allData = Promise.all([getData(queries[0]), getData(queries[1])]).then(res => fullArray.concat(...res))
        .catch(res => console.log(`${shop.name} Error @ promise.all()`));
    let ids = shop.ids; // might be removable...
    
    // uses data that has been merged into one array with each card storing it's own version number
    return allData.then((res: any) => helper(res, ids)).then((allCards: object[]) => {
        console.log(`${shop.name}: retrieved data...`);
        updateSquare(allCards, shop)
        .then(res => { 
            // Debugging and items created logs
            let created = (res as BatchUpsertCatalogObjectsResponse).id_mappings?.filter(idMap => idMap.client_object_id?.startsWith("#new"));
            console.log(`${shop.name} Square Response ----> : `,
                (typeof(res) === "object")? `${res!.objects?.length} items uploaded & ${created?.length} new item(s) created` || "unexpected" : `Update Failed`);
            if (created && created?.length > 0) {
                console.log(`New ID(s) for ${shop.name}: ${created.map(idMap => idMap.object_id)}`);
            }
            // Retry on Failure (!! will keep retrying until timeout !!)
            if (!res) {
                console.log(`Run full update again in 2 seconds`)
                setTimeout(() => {
                    console.log(`Restarted...`)
                    singleUpdate(shop);
                }, 2000);
            }
            // if (typeof(res) === "boolean")
            webResponse.push(JSON.stringify(res));
            return res })
        .catch(err => console.log(`${shop.name}: error log: `, err));
        console.log(`${shop.name}: square called...`);
    }).catch((err) => { console.log(`${shop.name} err: `, err); return "I am Error" }); //response.send(`${err}`)});
}

// Express endpoint to run full update when recieves request
// local: http://localhost:5001/taplists/us-central1/app/update
// deployed: https://us-central1-taplists.cloudfunctions.net/app/update
app.all('/update', (request: express.Request, response: express.Response) => {
    let combinedResponse = [];
    try {
        fullUpdate();
        // // Store responses to render?
        // combinedResponse.push(runUpdate(["CD", "CD3"]));//.catch(res => console.log("Caught During CD Update")));
        // combinedResponse.push(runUpdate(["GW", "GW3"]));//.catch(res => console.log("Caught During GW Update")));
        // combinedResponse.push(webResponse);
    } catch {
        console.log("Caught during update")
        combinedResponse.push("Caught during update")
    }

    response.status(200).send(combinedResponse);
    console.log("End of Code Reached");
});


// For testing purposes
// Currently helps delete old items
// uses ids to lookup the id of the actual item (rather than variation id) then deletes them
app.get('/test', (request: express.Request, response: express.Response) => {
    console.log("starting");
    squareTest().then(res => response.send(res)).catch(res => response.send(res));
    console.log("finished");
});



// Manages redirects for the url to return proper data upon request
// Uses Express.js for management
// todo: give shops individual addresses?
exports.app = functions.https.onRequest(app);

// Scheduled to run update automatically once each minute
exports.scheduledUpdate = functions.pubsub.schedule('* * * * *').onRun((context) => {
    console.log('This will be run every 1 minute!');
        
    // runUpdate(["CD", "CD3"]).catch(res => console.log(`Response CD: ${res}`));
    // runUpdate(["GW", "GW3"]).catch(res => console.log(`Response GW: ${res}`));
    
    return null;
});