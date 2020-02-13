// Modules
import * as functions from 'firebase-functions';
// Http request-receiving protocol for routing
import express from 'express';
const app = express();

// My imports
// import { CD, GW, key, token } from "./variables";
import { getData } from "./model";


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




//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Manages redirects for the url to return proper data upon request
exports.app = functions.https.onRequest(app);