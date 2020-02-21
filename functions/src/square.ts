import { CatalogApi, ApiClient, CatalogObject, CatalogObjectBatch, BatchUpsertCatalogObjectsRequest, CatalogItem, BatchRetrieveCatalogObjectsRequest, CatalogItemVariation } from 'square-connect';
import { square, posColor, Shop } from './variables';
import uuid from "uuid";

const defaultClient = ApiClient.instance;
// Configure OAuth2 access token for authorization: oauth2
// shorter:  ApiClient.instance.authetications.oath2.accessToken = square.accessToken;
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = square.accessToken;
// Sandbox setting: comment out these two lines to exit sandbox
defaultClient.basePath = 'https://connect.squareupsandbox.com';     // here
oauth2.accessToken = square.sandboxToken;                           // here


// Initialize api to be used
const api = new CatalogApi();

/**
 * Accepts array of objects 
 * @returns {CatalogObject} Catalog object as a catalog item
 * @param {object[]} taplist An array of beer objects with relevant information from Trello
 * @param {any} shop The object with shop information to access
 */
const updateSquare = async (taplist: any[], shop: Shop) => {
    // return taplist;
    // Retrieve batch of catalog objects to get Version number for overwriting
    let body = new BatchRetrieveCatalogObjectsRequest();
    body.object_ids = square.testIds;                                     // Sandbox: Ids to use in search for version number
    // body.object_ids = shop.ids;
    let retrievedObjects = await api.batchRetrieveCatalogObjects(body);
    // console.log(retrievedObjects);
    
    // Assign version number to property
    taplist.map((tap, index) => {
        try {
            // @ts-ignore
            tap.version = retrievedObjects.objects![index].version;
            tap.itemId = retrievedObjects.objects![index].id;
        } catch (error) {
            // @ts-ignore
            console.log(`Version Error: ${tap.beer}`, retrievedObjects.objects);
        }
    });
    
    
    
    // Could use more batches for different menus
    // ..but currently designed to keep them as separate requests
    let myBatch: CatalogObjectBatch = {
        // Look at each tap and create appropiate Square objects to be upserted
        objects: taplist.map((tap, index) => createSquareItem(tap, index, shop))
    }; 
    
    // Create new batchRequest, set idempotency key, and attach batches 
    let batchRequest: BatchUpsertCatalogObjectsRequest = {
        idempotency_key: uuid(),
        batches: [myBatch], // Array of batches
    }
    
    // For Debugging
    // return batchRequest;

    // Attempt to upsert batch and log the ids of objects created
    let upsertResponse = await api.batchUpsertCatalogObjects(batchRequest).then((resp) => {
        // For debugging/logging
        let ids = resp.objects?.map((elem) => elem.id);
        console.log(`Api call successfull for ${resp.objects?.length} objects`);
        console.log(`First 10 IDs (${shop.name}): `, ids?.slice(0,10));
        return ids;
        // return resp;
    }).catch((err) => [err.response.error.text, err]); 
        
    
    return upsertResponse;   
}

/**
 * Currently need a helper function to add the Square ITEM's variation property to the objects
 * @param {string} ids Array of strings with ids to retrieve version number
 * @param {Beer} dataResponse The array of objects to add the version number to
 * @returns {Beer} Same data with added version property
 */ 
const helper = async (dataResponse: any[], ids: string[]) => {
    return dataResponse;
    let body: BatchRetrieveCatalogObjectsRequest = {
        object_ids: ids
    };
    let retrievedObjs = await api.batchRetrieveCatalogObjects(body);
    
    // let version = retrievedObjs.objects![0].version;
    // return retrievedObjs;
    console.log("Data Size Difference (Trello - Square)", dataResponse.length - retrievedObjs.objects!.length);
    
    // Trys to add version number
    let notAdded: string[] = []; // Debugging logs
    let versions: (number | undefined)[] = [];
    dataResponse.map((beer, index) => {
        try {
            beer.version = retrievedObjs.objects![index].version;
            versions.push(retrievedObjs.objects![index].version);
        } catch (error) {
            notAdded.push(beer.beer);
        } 
        return beer;
    });
    console.log(`Version Not Added (${notAdded.length}): `, notAdded);
    let filtered = retrievedObjs.objects?.map(elem => elem.version);
    filtered?.forEach((elem, index) => (elem === versions[index])? null : console.log("Not the same version: ", dataResponse[index]));
    console.log(`Versions: ${versions}`);
    
    return dataResponse;
}



/**
 * Uses tap information to return a Square object with appropriate information
 * @returns {CatalogObject} Catalog object as a catalog item
 * @param {object} tap A beer object with relevant information from Trello
 * @param {number} index A count to help with debugging
 * @param {any} shop The object with shop information to access
 */
const createSquareItem = (tap: any, index: number, shop: any) => {
    // Create array of Price objects { name: string, value: number }
    // Name: To be listed as variation title
    // Value: Price for that variation ($0 | free if unavailable)
    let prices = myPrices(tap.growler, tap.serving, tap.price);
    if (!tap.serving) {console.log("No Serving: ", tap.beer)}
    

    // Create new object
    let myObject: CatalogObject = {
        type: "ITEM",
        id: tap.itemId, //`${itemId}`,  //shop.ids[index]
        present_at_all_locations: true,
        version: tap.version, // Gets version number by making retrieve request...buggy
        // present_at_location_ids: [shop.locationId],

        // item_data: data
    }
    
    // Set data of new item
    let data: CatalogItem = {
        name: tap.beer,
        abbreviation: `${shop.name}${tap.tap}`,
        // data.category_id = shop.categoryId;
        label_color: (posColor as any)[tap.type],
        // tax_ids: [shop.taxId], // taxes...
        // Add pricing variations
        // Uses tap information return and attach variation objects
        variations: prices.map((priceVariation) =>  // create array of variations
            createVariation(shop, myObject.id, priceVariation.name, priceVariation.value/1)),
    }

    // Append item data to object
    myObject.item_data = data;
    return myObject;
}




// Returns array of Price objects
const myPrices = (growler: any, serving: string, price: number) => {
    if (!serving) {console.log(`Missing Data: growler: ${growler} serving: ${serving} price: ${price}`)}
    // Initiate array to hold objects
    let prices = [];
    // prices.push({name: serving, value: price}); // Simpler?
    prices.push(new Price(serving, price));                         // Default serving size
    prices.push(new Price("64 oz", growler | 0));                   // 64 oz serving size && "Or" statement work here?
    prices.push(new Price("Half", price / 2));                      // Half of default
    prices.push(new Price("32 oz", growler / 2));                   // 32 oz serving size
    prices.push(new Price("Quarter", price / 4));                   // Quarter of default
    prices.push(new Price("Crowler", (growler / 2) + 1));           // Crowler price: adds on dollar for can fee


    return prices;
}

// Class for simplifying price objects
class Price {
    name: string
    value: number
    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}



/**
 * Creates and returns variation objects based on relavant parameters
 * @returns { CatalogObject } CatalogObject with type: ITEM_VARIATION and data stored in a CatalogItemVariation object
 * @default variationPrice Defaults to 0 if not provided (when no price given)
 */
const createVariation = (shop: any, itemId: string, variationName: string, variationPrice: number = 0) => {
    // Use variation price unless not provided
    let price = (variationPrice)? variationPrice : 0;
    // Creates item variaton to be appended to catalog object
    let variationData: CatalogItemVariation = {
        item_id: itemId,                                       // Associates variation with related Item
        name: variationName,                                   // Sets name of variation
        pricing_type: "FIXED_PRICING",
        price_money: {
            amount: Math.ceil(price * 100 / 1.101),   // Square operates in integers, acounts for tax at end
            currency: "USD"
        }
    }
    // Create square object and set type to Item Variation
    // Also attach variation data to object
    let myVariationObject: CatalogObject = {
        type: `ITEM_VARIATION`,
        id: `#variationId${uuid()}`,
        present_at_all_locations: true,
        // present_at_location_ids: [shop.locationId],
        
        item_variation_data: variationData
    }
    return myVariationObject;
}



export { updateSquare, helper };
