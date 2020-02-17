import { square } from './variables';
import uuid from "uuid";

import { CatalogApi, ApiClient, CatalogObject, CatalogObjectBatch, BatchUpsertCatalogObjectsRequest, CatalogItem, BatchRetrieveCatalogObjectsRequest } from 'square-connect';
const defaultClient = ApiClient.instance;
// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = square.accessToken;
// Sandbox setting: comment out these two lines to go live
defaultClient.basePath = 'https://connect.squareupsandbox.com'; // here
oauth2.accessToken = square.sandboxToken; // here


//shorter::  defaultClient.authetications.oath2.accessToken = square.accessToken;



// // For Sandbox Mode
// import { CatalogApi, ApiClient } from 'square-connect';
// const defaultClient = SquareConnect.ApiClient.instance;
// // Set sandbox url
// defaultClient.basePath = 'https://connect.squareupsandbox.com';
// // Configure OAuth2 access token for authorization: oauth2
// const oauth2 = defaultClient.authentications['oauth2'];
// // Set sandbox access token
// oauth2.accessToken = "YOUR SANDBOX ACCESS TOKEN";
// // Pass client to API
// const api = new SquareConnect.LocationsApi();



const api = new CatalogApi();
const doSomethingWithSquare = async (taplist: any[], shop: any) => {
    // Retrieve test
    let body = new BatchRetrieveCatalogObjectsRequest();
    body.object_ids = square.testIds;
    // return await api.batchRetrieveCatalogObjects(body);
    
    
    // Eventually use more batches for different menus?
    let myBatch = new CatalogObjectBatch(); 
    // Look at each tap and create appropiate Square objects to be upserted
    myBatch.objects = taplist.map(createSquareItem);
    
    // Create new batchRequest
    // set idempotency key and attach batches 
    let batchRequest = new BatchUpsertCatalogObjectsRequest();
    batchRequest.idempotency_key = uuid();
    batchRequest.batches = [myBatch]; // Must be an array of batch objects

    // batchRequest.batches = something.map..
    // batchRequest.batches = [new CatalogObjectBatch()];
    console.log(batchRequest);
    

    return batchRequest;

    // let apiResponse = await
    api.batchUpsertCatalogObjects(batchRequest).then((data) => 
        console.log("api call successfull..", data))
        .catch((err) => console.log(err));
    
    return batchRequest;
    // param.map((beer) => new CatalogObject());
    // api.upsertCatalogObject()

    
}


/**
 * Uses tap information to return a Square object with appropriate information
 * @param {object} tap A beer object with relevant information from Trello
 * @param {number} index A count to help with debugging
 */
const createSquareItem = (tap: any, index: number) => {
    // Create new object
    let myObject = new CatalogObject();
    myObject.type = "ITEM";
    myObject.id = `#newId:${square.cdIds[index]}`;

    // Set data of new item
    let data = new CatalogItem();
    data.name = tap.beer;
    data.abbreviation = "abc";
    myObject.item_data = data;
    
    // data.name = "test";
    // myObject.item_data!.name = tap.beer;
    // Attach each object to the
    return myObject;
}












export default doSomethingWithSquare;
// export { doSomethingWithSquare }








// // Firebase: 
// // const config = {
// //     apiKey: "",
// //     authDomain: "",
// //     databaseUrl: ""
// // }
// // firebase.intializeApp(config);
// // var rootRef = firebase.database().ref();

// console.log("iloadedme");