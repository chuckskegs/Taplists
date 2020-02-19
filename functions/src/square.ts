import { CatalogApi, ApiClient, CatalogObject, CatalogObjectBatch, BatchUpsertCatalogObjectsRequest, CatalogItem, BatchRetrieveCatalogObjectsRequest, CatalogItemVariation } from 'square-connect';
import { square, posColor } from './variables';
import uuid from "uuid";

const defaultClient = ApiClient.instance;
// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = square.accessToken;
// Sandbox setting: comment out these two lines to exit sandbox
defaultClient.basePath = 'https://connect.squareupsandbox.com';     // here
oauth2.accessToken = square.sandboxToken;                           // here


//shorter::  defaultClient.authetications.oath2.accessToken = square.accessToken;


const api = new CatalogApi();
const updateSquare = async (taplist: any[], shop: any) => {
    // Retrieve batch of catalog objects to get Version number for overwriting
    let body = new BatchRetrieveCatalogObjectsRequest();
    body.object_ids = square.testIds;                                     // Ids to use in search for version number
    // body.object_ids = shop.ids;
    let oneObject = await api.batchRetrieveCatalogObjects(body);
    // Assign version number to property
    square.testVersionNumber = oneObject.objects![0].version as number;   // <- Sandbox
    shop.version = oneObject.objects![0].version;
    // return await api.batchRetrieveCatalogObjects(body);
    
    
    
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
        let ids = resp.id_mappings?.map((elem) => elem.object_id);
        console.log("Api call successfull..");
        console.log("First 10 IDs: ", ids?.slice(0,10));
        return ids;
    }).catch((err) => Object.keys(err.response)); 
     
    return upsertResponse;   
}


/**
 * Uses tap information to return a Square object with appropriate information
 * @param {object} tap A beer object with relevant information from Trello
 * @param {number} index A count to help with debugging
 * @param {any} shop The object with shop information to access
 */
const createSquareItem = (tap: any, index: number, shop: any) => {
    // Create array of Price objects { name: string, value: number }
    let prices = myPrices(tap.growler, tap.serving, tap.price);
    // console.log("Test: ", prices);
    
    // Create new object
    let myObject: CatalogObject = {
        type: "ITEM",
        id: `${square.testIds[index]}`,  //square.cdIds[index]
        present_at_all_locations: true,
        // Idk why this is the version number...buggy
        version: shop.version, 
        // version: [shop.version];
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
            createVariation(shop, myObject.id, priceVariation.name, priceVariation.value)),
    }
    
    
    // data.variations = prices.map((priceVariation) => {
    //     return createVariation(shop, myObject.id, priceVariation.name, priceVariation.value);
    // });
    // Append item data to object
    myObject.item_data = data;
    
    
    

    // data.name = "test";
    // Attach each object to the
    return myObject;
}

// Returns array of Price objects
const myPrices = (growler: any, serving: string, price: number) => {
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




const createVariation = (shop: any, itemId: string, variationName: string, variationPrice: number) => {
    // Creates item variaton to be appended to catalog object
    let variationData: CatalogItemVariation = {
        item_id: itemId,                                       // Associates variation with related Item
        name: variationName,                                   // Sets name of variation
        pricing_type: "FIXED_PRICING",
        price_money: {
            amount: Math.ceil(variationPrice * 100 / 1.101),   // Square operates in integers, acounts for tax at end
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



// creates object with price information
// @ts-ignore
// depricated 
class Prices {
    // Determines display order?
    ["20 oz"]?: number
    ["16 oz"]?: number
    ["12 oz"]?: number
    Growler?: number
    Half?: number
    Crowler?: number
    Quarter?: number
    constructor(growler: number, serving: string, price: number) {
        // this.Growler = (growler === 0)? growler : -1;
        if (typeof(growler) === 'number') {
            this.Growler = growler;
            // this.Crowler = Math.ceil()
        }
        // this["16 oz"] = "hello"
    }
}

// @ts-ignore
// Depricated
// Returns an array of variation items
const getVariations = (tap: any, shop: any, itemId: string) => {
    // Create array and add first variation object using the "Default Serving Size"
    // let myVariations: CatalogObject[] = [createVariation(shop, itemId, tap.serving, tap.price)]; 
    
    // Required to do this before?
    // if (tap.growler === "N/A") {
    //     myVariations.push(createVariation(shop, itemId, "Growler", 0));
    //     myVariations.push(createVariation(shop, itemId, "Crowler", 0));
    // } else {
    //     myVariations.push(createVariation(shop, itemId, "Growler", tap.growler));
    //     myVariations.push(createVariation(shop, itemId, "Crowler", tap.growler / 2));
    // }

    // Create array of Price objects { name: string, value: number }
    let prices = myPrices(tap.growler, tap.serving, tap.price);

    // Traverse over prices and create variations...
    let myVariations: CatalogObject[] = prices.map((priceVariation) => {
        return createVariation(shop, itemId, priceVariation.name, priceVariation.value);
    })

    // // If need to change names...
    // switch (tap.serving) {
    //     case "4 oz":
    //         myVariations.push(createVariation(shop, itemId, "test", 55));
    //         break;
    //     case "12 oz":
    //         // myVariations.push(myVariationObject);
    //         break;
    //         default:
    //             break;
    // }
            
    return myVariations; 
}




export default updateSquare;
// export { updateSquare }








// // Firebase: 
// // const config = {
// //     apiKey: "",
// //     authDomain: "",
// //     databaseUrl: ""
// // }
// // firebase.intializeApp(config);
// // var rootRef = firebase.database().ref();

// console.log("iloadedme");