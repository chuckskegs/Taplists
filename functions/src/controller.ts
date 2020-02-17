// Firebase to create http callable endpoint
import * as functions from 'firebase-functions';
// Http request-receiving protocol for routing
import express from 'express';
const app = express();

// My imports
import { getData } from "./model";
import doSomethingWithSquare from './square';
import { CD } from './variables';


// Manages *./app/data endpoint requests
// Uses query info from request to determine which data to return
app.get('/data', (request: express.Request, response: express.Response) => {
    response.set('Cache-Control', 'no-cache, no-store');//'public, max-age=5, s-maxage=5');
    let query = request.query;

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
    query.menu = "CD1";
    // get data for each menu and add to database
    // then update square with this information
    getData(query.menu)
        .then((cards) => {
            doSomethingWithSquare(cards, CD).then((resp) => response.send(resp)).catch(err => console.error(err));
            // response.send(cards);
        }).catch(err => console.log(err));
});



//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);

