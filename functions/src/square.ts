import { CatalogApi, ApiClient, CatalogObject, CatalogObjectBatch, BatchUpsertCatalogObjectsRequest, CatalogItem, BatchRetrieveCatalogObjectsRequest, CatalogItemVariation, BatchDeleteCatalogObjectsRequest } from 'square-connect';
import { square, posColor, Shop, setup } from './variables';
import { v4 as uuid } from "uuid";

import * as serviceAccount from './googleKey.json';

// for database access
import * as admin from 'firebase-admin';
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "taplists",
      clientEmail: serviceAccount.client_email,  //"firebase-adminsdk-emgbw@taplists.iam.gserviceaccount.com",
      privateKey: serviceAccount.private_key, 
    }),
   databaseURL: "https://taplists.firebaseio.com"
});

{// let credentials = {
//     credential: admin.credential.cert("src/googleKey"),                             // Auth / General Use
//     // authDomain: "taplists.firebaseapp.com",         // Auth with popup/redirect
//     // // storageBucket: "talists.appspot.com",          // Storage
//     // // messagingSenderId: "123456789",                  // Cloud Messaging
//     databaseURL: "https://taplists.firebaseio.com" // Realtime Database
// }
// // let creds2 = {
// //     databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
// //     credential: admin.credential.cert({
// //         projectId: 'taplists',
// //         clientEmail: 'beer@chuckshopshop.com',
// //         privateKey: '-----BEGIN PRIVATE KEY-----\n<KEY>\n-----END PRIVATE KEY-----\n'
// //     })
// // } 
// admin.initializeApp();
}

setup();
// Configure OAuth2 access token for authorization: oauth2
const defaultClient = ApiClient.instance;
// shorter:  ApiClient.instance.authetications.oath2.accessToken = square.accessToken;
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = square.accessToken;
// Sandbox setting: comment out these two lines to exit sandbox
// defaultClient.basePath = 'https://connect.squareupsandbox.com';     // here
// oauth2.accessToken = square.sandboxToken;                           // here


// Initialize api to be used
const api = new CatalogApi();


/**
 * Accepts array of objects 
 * @returns {BatchUpsertCatalogObjectsResponse} Catalog object as a catalog item
 * @param {object[]} taplist An array of beer objects with relevant information from Trello (JSON?)
 * @param {any} shop The object with shop information to access
 */
const updateSquare = async (taplist: any[], shop: Shop) => {
// try {
    // if (!taplist) { return "taplist not provided" }
    if (taplist === undefined) { console.log(".......taplist data missing......gonna be an error....")}    
    // Retrieve batch of catalog objects to get Version number for overwriting

    // Get database reference and set value to be checked before upsert
    let db = admin.database();
    let ref = db.ref(`${shop.name}`);
    let myUuid = Date.now();
    ref.set(myUuid).then((res) => console.log(`${shop.name}: 'set'`)).catch(err => console.log(`${shop.name} DB err: ${err}`));

    // Retrieve objects from square to read version numbers
    let itemIds = shop.ids;                                 
    let body: BatchRetrieveCatalogObjectsRequest = {
        object_ids: itemIds
    }    
    let retrievedObjects = await api.batchRetrieveCatalogObjects(body).catch((res) => {console.log(`Error getting ${shop.name} items from Square`); return res});    

    // Assign version & itemId numbers to property
    taplist.map((tap, index) => {
        try {
            tap.version = retrievedObjects.objects[index].version;
            tap.itemId = retrievedObjects.objects[index].id;
            // console.log(tap.itemId, retrievedObjects.objects![index].item_data?.name);
        } catch (error) {
            console.log(`Version Error: ${tap.beer}`);
        }
    });    
    
    // Create Square objects using taplist data
    let objects = taplist.map((tap, index) => createSquareItem(tap, index, shop));
    
    // Could use more batches for different menus
    // ..but currently designed to keep them as separate requests
    retrievedObjects = await api.batchRetrieveCatalogObjects(body);
    let myBatch: CatalogObjectBatch = {
        // Look at each tap and add version identifiers to objects
        objects: objects.map((tap, index) => {
            if (retrievedObjects[index]) {
            tap.version = retrievedObjects.objects[index].version || 1;
            }
            return tap;
        })
    }; 
    
    // Create new batchRequest, set idempotency key, and attach batches 
    let batchRequest: BatchUpsertCatalogObjectsRequest = {
        idempotency_key: uuid(),
        batches: [myBatch], // Array of batches
    }

    
    // Attempt to upsert batch and log the ids of objects created
    // --- move to "Else" statement below?
    // let upsertResponse = await api.batchUpsertCatalogObjects(batchRequest);
    
    {    
        // .then((resp) => {
        //     // For debugging/logging
        //     let newIds = resp.id_mappings?.map(elem => elem.object_id); // creates array of all the ids for new objects created (items & item_variations)
        //     let resObj = resp.objects!;
        //     newIds?.pop();

        //     let successful = resObj.map((elem) => `${elem.id}: ${elem.item_data?.name}`);
        //     console.log(`Api call successfull for ${resObj.length} objects`);
        //     console.log(`First 10 IDs (${shop.name}): `, successful?.slice(0,10));
            
        //     let created = resObj.length - itemIds.length;
        //     if (created) {console.log(`Created ${created} objects for ${shop.name}: `)}// , resObj.slice(0, 5) || newIds?.slice(0, created))}
        //     else {console.log(`No New CatalogItems Created for ${shop.name}`)};
            
            
        //     return successful;
        //     // return resp;
        // }).catch((err) => [err.response.error.text, err]); 
    }

    // Trial 2
    let dbVal = await ref.once("value");
    if (dbVal.val() !== myUuid) {
        console.log(`XXX ${shop.name} mismatch XXX`);
        return `My Error: values don't match: ${dbVal.val()} != ${myUuid} (expected)`;   
    } else {
        console.log(`---${shop.name} matches---`);
        try { return await api.batchUpsertCatalogObjects(batchRequest); }
        catch(e) { 
            console.log(`-- Unsuccessful Batch Upsert for ${shop.name}`);
            //@ts-ignore
            // console.log(batchRequest.batches[0].objects[0]);
            console.log(e);
            // return (e)
            return false;//`-- Error - Unsuccessful Batch Upsert for ${shop.name}`
        }
    }


    // Throw error object if logged value in database does not match
    // returns snapshot...
    // return await ref.once("value", async snapshot => {
    //     let snapVal = snapshot?.val();
    //     if (snapVal !== myUuid) {
    //         // switch from throw to return...
    //         console.log(`XXX ${shop.name} mismatch XXX`);
    //         return `My Error: values don't match: ${snapVal} != ${myUuid} (expected)`;   
    //     } else {
    //         console.log(`---${shop.name} matches---`);
    //         try { return await api.batchUpsertCatalogObjects(batchRequest); }
    //         catch { 
    //             console.log(`-- Unsuccessful Batch Upsert for ${shop.name}`);
    //             //@ts-ignore
    //             console.log(batchRequest.batches[0].objects[0]);
                
    //             // // Retry on failure...
    //             // setTimeout(() => {
    //             //     // admin.app.call({}).instanceId
    //             //     console.log("5 seconds have passed");
    //             // }, 5000);

                
    //             return { error:`-- Unsuccessful Batch Upsert for ${shop.name}` }
    //         }
    //     }
    // })
    // // .then(res => {
    // //     console.log("log me responsingingngngngng :", res);
    // //     return "logggggggggggggggerrrrrrrrrrrrrrSSSSSSSSSSSSS";
    // // }).catch(res => res)//.catch(res => console.log(`Caught error for ${shop.name}: ${res}`))//delete?
// } catch { 
    console.log(`Catch block error for ${shop.name}....never reached am i?`) 
    throw { 
        me: 1234,
        shop: `${shop}`,
        taplist: `${taplist}`
    }
    return null;
// }//delete?
}

/**
 * Currently need a helper function to add the Square ITEM's variation property to the objects
 * @param {string} ids Array of strings with ids to retrieve version number
 * @param {Beer} dataResponse The array of objects to add the version number to
 * @returns {Beer} Same data with added version property
 */ 
const helper = async (dataResponse: any[], ids: string[]) => {
    try { return dataResponse;}
    catch { 
        console.log("Helper Error");
        return dataResponse 
    }
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
const createSquareItem = (tap: any, index: number, shop: Shop ) => {
    // Create array of Price objects { name: string, value: number }
    // Name: To be listed as variation title
    // Value: Price for that variation ($0 | free if unavailable)
    let prices = myPrices(tap.growler, tap.serving, tap.price);
    if (!tap.serving) {console.log("No Serving: ", tap.beer)}
    
    // Creates new Id if necessary...so if there are more cards in the Trello lists than the number of ids in the shop.ids array
    let itemId = (tap.itemId)? tap.itemId : `#new${uuid()}`; // Create new if non existing?

    // Create new object
    let myObject: CatalogObject = {
        type: "ITEM",
        id: itemId, //`${itemId}`,  //shop.ids[index]
        present_at_all_locations: false,
        present_at_location_ids: [shop.locationId],
        version: tap.version || 1, // Gets version number by making retrieve request...buggy
        // present_at_location_ids: [shop.locationId],

        // item_data: data
    }
    
    // Set data of new item
    let data: CatalogItem = {
        name: `${shop.name} - Tap ${index+1}: ${tap.beer}`,
        abbreviation: `${index+1}`,//${tap.tap}`,
        category_id: shop.categoryId,
        label_color: (posColor as any)[tap.type],
        tax_ids: [square.taxId], // taxes...
        // Add pricing variations
        // Uses tap information return and attach variation objects
        variations: prices.map((priceVariation) =>  // create array of variations
            createVariation(shop, myObject.id, priceVariation.name, priceVariation.value/1)),
    }

    // Append item data to object
    myObject.item_data = data;
    return myObject;
}



// Returns array of Price objects for each of the serving sizes
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
const createVariation = (shop: Shop, itemId: string, variationName: string, variationPrice: number = 0) => {
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
        present_at_all_locations: false,
        present_at_location_ids: [shop.locationId],
        
        item_variation_data: variationData
    }
    return myVariationObject;
}





async function squareTest () {
    let ids = ["CPV6XO6OYMTMEK2W72AEMEQQ"];

    let body: BatchRetrieveCatalogObjectsRequest = {
        object_ids: ids
    }
    let resp = await api.batchRetrieveCatalogObjects(body);
    console.log(resp.objects?.length);
    return resp;

    let objIds = resp.objects!.map((elem)=> {
        return elem.item_variation_data?.item_id;
    });

    
    let filtered = objIds.filter((elem,index) => {
        if ((index%6===0)) {
            return true;
        }
        return false;
    });
    return filtered;
    // return deleteItems(filtered as string[]);
}

async function deleteItems (ids: string[]) {
    // let ids = ['V4XZDB2RXDFTTWVOZD4EDYNF','QLD7GWGOOC2UJQ34YM447JCH','3D435CXLUQCAKDTQWOQHVWUD','YYBVZH57LQK6CSBFTJZG7LEW','WDL4MBETS35QIJO33RKMUYWK','KGYEEHBGTCY5TKPK4EW5QSRI','TGOQQX7SM756OE5XYXE2MWVK','5QGMKKQBYCOEHTBAGGMNRGDH','Y4KOS476ZAWAMZSWAPTB63YR','DRHTIDXUHLYBME7TTKNQABZV','KNSPADBSVGDQ6YS43NL4Q26I','SZOVSW5QEPRWQNXEXFSTS5LH','XACXUAWOBFEFIVA2EOMPXZ7A','FCAKRX4XKOKPQ7QW3RKLKOIX','NRJASRN6UQAH266NM2SALMPX','EVVK6F4Y7G23E644IE5QC4A5','RFHJT527XOQ4UEOTWL2KK7HY','C7QPGXWS4TTWTMDHZZREULQD','2P7KW4PRZSP5HSV6SLLBBJL4','MEQGQMKGU6PHSUWXMYCCN5LW','7B5EWNGHUZIWK2MYF3EWL7JF','UPKIONCY6M6HVCXVMNFL3JKS','V2DT7MGXOB4WCHXDKKACSSKK','ZJYRUYKGTYEGKAK7TTNBW5SA','5OP6SJAJVD55FBG7ZKVC2A74','R375GR4LYRVCPDHUVV2P3ETO','V7WCGWOFFPIO2OQNSRLFMFQI','ND4VH76J5W2ZT6OJHMAPGR2U','VNOOP2IXCMHZVODUUPIADIOP','X3FTRXQBIFGUGFOBUOCCUJQD','XQRJLNOMKTTJGA4D5KNJ7XY2','ZWB3FFQG5COJHXSVWJIM5XLG','IZXNMV45GHQFSBYTLTRCCDIO','ZTL2TFIO4PIWHPY6WO5ANJYZ','TPF63AHPHXODS47GR2GFIRXZ','NIGBZUBNJKZM3VWK3MC27FTI','22SFQJSHNLSNP63BQ2MKZHVM','5LRM3TPIDABDQ5EIIVT6NLYG','I3FEBGCQDAHV2FLVS4VNJ6UH','5UYAGVMWXFMRXV53GQNVPOZA','M4DQEFSSKK42DBGUXOMD2NY7','4YIWASVSVSZ2IM2ALJL5VBL5','N5OB6KE6XPDO34C5IHK2MPVP','IDI7OOTH2QWDJZV2QWINYGBM','LX5PVRLZK5R777C5P24C2KGS','NVGACG3AOQ2LOBR6E56TLFH6','NI4LQTS5MANJU43GW7L42QFV','UV3ZF363T6YSYI4OW43VOJXZ','QCWUF5XE2XK7ZWXAS77UOA53','BUHMO66LRZCJ7CBV5GH2HEBN','DWFXZC6E27URH42S3YRFE5WQ','CZOZ6G76ORPNDOY2GBZ6XMIS','CZY6H7XIQK3JNBPNYMOXC6OW','4IOL56JHQ25IFTGPISV3IYGI','BJEYF5QFROEKA3G5KTEV7W62','KQLURM6NQOEWSFTF3DDJIHU7','J5X7EU4ETPHFQPA6RV3RHJKQ','JMHOGZUXWPQSWWAI6JZ3K5F2','CIMIKMFSXPBPWXWQBJ3AQVVA','VX3JMNX5H435U7XPBIN6TP64','LMHCG2ELNT34D5735GIVPX6J','VLUEHX5S2J54H2XEVUVKBHLP','AFK4OP2I5767KCW33PFAGBI2','X6LLQOONJOFVTEUYR6LH5ZAR','EC4D7AMT32XHOGICUO32HFZS','R2CNPWI6DIT3DKO23ZZCILML','TNBCINIAMMCT6D6SQNGRWARK','77XELXY3JGHRWL66DKL6ZH4U','CXX4PSKQZK5OPZR3MS2VRY7S','7U2BMOQL52FF2CI3A5CYNK2X','FMMP46YUDIEJWLF6FZ5AAAEI','FLCLR4GXKEJN5JE5DTWM3CXG','7CNQ6E7JFVO5HBMA67UPLWTS','MIXY77O4MC2OZEEMVI6ZQJGD','74PAPUZ323HG26DQXQOLYW4V','PM4TH3W6JMM2RER2T5EP7T5T','QUANKOPSXOLHNMXLVJMBGKPF','H53WEG7CTALV7AA6CMQO2X2M','45GRFBOKP75ISYWCX2MGFHPR','MH2MXC3THHN3ZCJBRJYND6BN','GBVB54KJXT6VFODHUPG54DAX','JNBQFMVRZI4OK3UMM76IQSRK','PFS4YPQHCJYNLKTQZ4ZNCRBK','2FRGBQD6C3Q4KZGKYG7K7XI3','U7T5GHYYHQRBZC53P5WXSPQN','CC2WP4HVDPNNEUL6VHWNQ25G','CUA5QPCGZZANCR7IS3KSGSKA','WIFM7CVH2KI2XTTY7IPJ2HAJ','R5G2KYOSAMNJHRZATSAIUVAE','HEIU2FPQ5WZ2HM4UOEAO7V7D','A5SSMUHNAX2S6YOZ22QU27K6','UXJ64X6BDLBAR4H5JSH7S5W7','57TLVMNQRLSVWFVABGJIILMX','7TVGKIEP64AAE3VWXR6ZGSZP','7AKJGJAZ2U7ZDLOFBPRJVBHA','W323AG7XBSXDGLOGG2A2I3F5','BLFBOTFYHO5BCVAMUBJJMAXM','PPH5X3NAJKTM54DQXQUJIGBV','WO6JA7IXS2V7NUMGM5PGZBYC','7NIJU45U64MJA5523WMVSJLL','KSNXNAFEDQTIAGWUAAPBTPZO','UKCRKT2PWH42WB7XBCANFCT7','PPXIAKD47VVTXXIAXMVWI6ZK','MKFJ2J36QYBLH3TXPHX3E7DB','P7ULYMD7BWNHGBGQ3VFGTTIJ','YBU5CEKTFG6T7P5KXT47AV2C','GWUREXDPLBXELVXAEPY6PGJX','6XDVWLQTDDNAQAIP6QL5V4BE','VIXRLCHSPIVHFZORGBE3J5LO','QVHXHXHFOKN6VSM5N4RXEPTO','32NZ3ZRQHNBIOVTR6E5UZ3TJ','FEKHBA75JANGU3VJFBFB5W6L','ABHHFLTA4UFEU6VMN5PHZYLZ','N5NHGYSMHDYD4YPEKV57KV3Q','RSBTIASD6TDBTVEOTHGQRH2B','E3XEO6ZKH3JFHGO6O3QPY6T2','7DDU5SCCHNTXWEI3VKNT4ZQA','KVVEWQDPMHVJHUV2KTSNODTL','AHCHMPEDDK5HPJUVJ6P2KUYC','XM5EPD6WIH6EIOXDODEBZ5BG','3N7GGQ3JXSO6MOYAIZW57AJE','Y5AEECVTQ43NYCXR7RBA5PX4','ICSHDUQEBKEJVPAQMFFSQFKE','67HHOVMKPA2K2CUAHLZ3C4JX','TPWVJWL5NYACCQKIHODRWMFG','DOHQACIVMSIC6NLDEGI6VOET','BMKOFAZ4T36TEQO6YOSQJDRZ','QUWXJOLFYSH2PWEUV6H7LZDF','F6IIOU3FGCIZZAW5AFWEQAOP','EG2CDTDPMDVF2Q7LXDC6PUYD','EBETU6EY53LOMNTKU53XMOEX','IZHGK3VHWU3XKHNDABPB2ZAB','IAV5EF56T7U7EJD6U4JB4W4P','3YGGKJDIMME4Q7EGU3FQIRYF','XMYRMXB4RNCZBP4PKS7VI5YF','EEFFLEF4ZIKLDDDBBHRBYDYL','N3IT2HGBNJPOEANIWCJ5HMO6','CN7KXLAISS4KP5XRKHHUOWKL','S6NM4BYIP4ZRMS2C2H73VFXO','MVGCD2XFKU2SVF2NYLSAI6M6','MEQW6CT37FO4B6VRJKU27TPQ','YXAABOGYUMVOWWIYQH7C7ST6','CWU5XAUTGY6BLD26FXQGW2PI','KQJUEJKH3773IOXH22PT4KGW','JOPZ7H2IZAC7KJTT7BJCL3LE','2WHZOCEUSYCAHGZINZFFI6EA','TLHC2CW3XD7LBW7GJXKCIUPF','F4RB4LUI2E22JBLBBRI6Z7JF','3S5NEGER4L6676RLX4J6FNV7','Z6WMODW4LEUETJNIZEJ6MRPY','2DCC6VRZVF2EFUS2YUZGO6KB','QIRUNBLESFHVKDEP2U4E64DB','F7D3V2T2PJWFRWOHOIUQQIID','IHATVSJGHB3BZNQR6O7SQL5A','IU3VGBSLPBF4R7DZK4P4DV4T','7I6UNO5RRQVATB2YXZ44XRJW','SK7Q66HECI47U6E45JT35EEO','HTV3QPWQ2WEA4AWO7NDCSQHP','YVBO7MRJRBWKNCXE63ZA4SGC','HBFX6Q3RMZ565TKPBEFR3ZNT','5RIQORMF2UL677TWXJ7BLSF5','HWVGK3V7WUFTFBWSZFN2A5II','GGQXOD37VQV57SOVUG3FXYRS','XH6XVR5IWM3E2WPXXAYHYGQZ','C4Y2W6JXKJ36SZHYLI5NTBK3','MUT5RLLKPKHIKFI3RWT2BQE3','CJH7Z2BUY53ZTTD2POYVYSHB','MRKFCOXCDOKBHVHCF5NVHV5L','MB3EAUMLFJQUYGBFMRASA6OM','Y7WNQFARCDOL7J5LPDBVF6YQ','URM7BXOBQUBALNZAEHWPJMC4','5GSXXSTY2XGVBTGXHEL5KV3R','EXNZPEHTMZCC4TDOBLBAVFCM','JNHUXUWZHDRFEA4IPF7P6QJJ','UZM5MBQTACZI5JLJNBFBLFUG','MRQCLWKUBQVFZRDXFUMBMKBI','RXJI4L3IVOBM4JEQFAEM3FK6','L53TLEQRASYVJXKHTX4SGRCS','LCQXXMO2XTCAW3EKCY6DR33U','LZPFL6G7FXQEYV36W3BPS6EU','27KJ6LRSXKI4DNYICCSSPLTP','DY7SZH4TZZIM2TCWJWCRJWZ5','4BETNOGZFTQG2ZNCLH7QWZRT','PE36ZU7CA2HN6G6PM5PRMSQV','HRJUZ3IJWRNF4ILNBNWKMNAM','ONTUGOFLITY5TWTTEM7GHMM5','NMBMMM5X6P2P7QRXSZWVVZGB','72BMXGEK666GULPBGS2K6KLN','Q42QAC7EUBWFRNYR2JEWZMS3','GQDKUBHFM7HXY7EXBVZGQR2Q','MTAYJQABL5EAD3EE742BPUND','UUMKGR5KOVX772WJK6D2KPDK','ZLJB7BEWEIBJ3YKY7YWN6UH5','4WBKK7CQSWLE5VX7YMLQWGC3','Z2BHKKOAYKD6K3IYYRXAC6KZ','MMKTXS5Z76E7HCKOJ4IAZWMU','TPUTXKHRVEVKWUUHHXLGAXNU','D5YOCVMMW22ISYPSHPBRPODQ','O26BOBVRPD2UXNVXI74Z26JU','BMQOF3LO5RPYATOOEFEYCFAO','B6UPFOFPEXYAO3CN6O3IUWJ3','WJHMLTZHOPISDXWXKE3L3VNR','EEX7NEC2JUSGETSWE4B4KYBF','TBQMYJV3UN4QI447TWMDDRCY','VJACZQ4KMQLASFX77A4QS2D7','F2ZU54QDXR3VPU3TXYWBXMCY','H5XDWRNIXNLO5X4LB632WPTR','F7WT4FSQFCEVXO5LQFV4BH5P','3KT4KNCDLUXKLCCIIDSC4YRD','ZLTBWCIRXZAQCR7SSAJT3UHN','I3DWVGXB6EWTFLZEX4SGZ7FV','DSDYVLEPFQ457DH262PGM5L3','DZBGV44HJIXQPSDEKMQ6GW2Q','GOELPJWAR4ARUW7Z23TASDBJ','WAREDJ2UST43VD7DSKWCPGN3','4T4FF4RPXABMROLHZ7KJWYHC','P2I26UWK7JS4KGPXCPOGJKDS','LRDHHKQIVVR2RP7IQOLHO77D','LYYIDJ2N3OEIDQCTWANNMA7V','H7H342JJG2UEVGZZYKD2XF5Q','P4DVKMF4LQMFIUKHAQSKNYXD','4HU4OAFFEMNHOAC4C4ENQ2NG','NAPVNIGMSPHVOWA5ZAWZPTRQ','5B66M2MG5SB6JJ7OPTWQ2VIL','OYILECGXEX7XQND3FURQRAL4','BSL6JCZYED7VEOFEFSHX3SZI','KDZ5IDHT2JVHJKJ36OMMCCMW','RSPSGAEB4XNKCYBU5GQADCUV','WE2CSAZ5JA57GJNWFU72HVU2','EOWK2JTD2JTLDBWNK5FS4YAO','NUDFDCSMRUHALVWJ6EZ5S6JO','XXP6UAXR6FES4WNJLNFVBZQW','6NTGEJ2IICJLNVAA2Z5YJGG7','CDO3ATSXH6HF75IUSCS2PT7L','6LMUKXDXTRFP2GLBFZAPIOQM','PE5BDK22BIG2U3JXHQA53LRI','34RRZ5DY5Y6TGVAANRJRZXTY','GWKTMSGK7RBSUA3IERACIYWS','SSZAHBN25X3OIL6WGJ3LEYSD','NNHDPEZDXC5U3WGS3JEKGT2L','VGU3MBFZC5KMKZPHDBHODPCD','WF5SBIS6424VBFRZ4CSEUP4X','QCNSHFDGQAIJQSFEUDPWPPY7','YT3EVRSK7554E75MCMBYINSW','KGHRTBPOK7KGLPUDZDEAEGYH','3Z6LVC43EY66WWMGKLUI7W5B','PWPBHJI2W32RFCJ4WCIRCQMG','ZKDZLYQSIURAZQTGS7FLIKUZ','QKTWZJMBT4BZ4NNFTASGLFYH','R2N6UG4LLAVQWPOKQ55JQFG3','GC2OWC7UZAWJEKAXWUWFVULY','MR26TLVOI4KQSXR3T2IBKNVO','HVQ3OOISHZFADAJ3XFXS3CWK','BLJKYY4DKEFNDIXSDS2HZZSH','NCD5VDAB5663KBLK4UJ2HCHD','4PZLD3HNS7GXNWBF4ERA6JVD','IKJGVOZ4PRQHPKU65GQR3Q2M','QMB2WLLSFZA37O5KAFQD2GHL','QKYBD4BMOY2MUHNJS3XBPT6M','X7M37XM5IYQAT4CH2EU3RKWS','RZTDQQ7NCCQ3EV52GRXMSTNY','FK3KRWDEDLVZVATD3TZIOGA4','GIRYALP3LC2N6UJKJU4JFFR4','MHSVOOLQTBLU7ZH4KDGCP3SW','KRSAR4UVS2HONMQ6IKGLWTVT','QSWTDFPTES5H5G5DNIGGYXLT','5OOZXVYGMLE6MSBQWOIS6ZP7','C263D46F5XUFF2O7R45IXTH7','4BDQ5WEZHLYXI3TFVNHIYOLQ','LJLGDXEFUZJGQRMF4PWCYDXI','6D3NDN7G34VJAGQEBTVCX3V2','QKK6MOQFXCS4AFR5ADCX35RX','PPBNQWSKWOVRR4DRGR7IIZY2','WZQLOQSBEDNUV5MP6K4PRXSO','XOA6C2I3SGXO6MEZCL2LTLYV','QYD3OQJOHPDY4GMMRCRZGTW6','YS3IGK2AYJZQUXIWZ725MADG','WDNU5A7IDQN7RHUDJXO4BAJA','4H65NDCXH7CLXXRYXI7NEAC5','ZFTEVJCVYX7RHBKPUIMOL4M5','UHHLJJ7UZ6PZU5ZPE3AVOC5D','ROGICJTNVO2TXA4VILQAV2VS','UPUPI4C4RQEMLTV6ZEQERMXZ','IEKLRF7XOMKAQRL4YPYDGIVA','GIFLEU5XT6N2LRHI75TU5J2P','W4NSTTC4YZSVXVJZ2LG55QFC','ZTZTX4E7YWZEQ7MAMXKGAGTA','XXQSI6ALTWJ5T3TVQ57XCYTL','P46RCAZO2L7522S7Z7GDNIO4','NBOJ2MGBBQPNIWCTOTY73QE5','6QCYY2ZH5X7ZA3EBQGMJ2J34','NDWRDAMT74GRBHGE2CAD3DJO','FNWBSNDNDJQYMGISVF4CA2D7','3CH3KMGK3LRP5ZA4CO474RTH','OPEVPJSBA2P4IREKKHKRSYQ5','TJZ3A4J3ATTSKHO73FNVJAXQ','VL7ACX7WAZU3F5SV7XRXYEWE','3J43ELGRSCTFATDVA5ELUHRA','2J5LS2G6G5MRNTD54UPIYF3Q','MHENJE6G6Z4MGWZW2TZOUCSU','3VU6GKHCG4WRJLCFRCGWAOMY','L6QNB7HTQWHRJULHGFB2JAHD','J426G3HZ6NX6SVTGVGTGKFXD','NYCJZ5S4YZ66DJZVLHQZW7XX','E547WS2CFXYMEE533ONOR4ED','ZICRYUVJK7YASWEXNNK2V2V6','FVWHG4APNV57XR5K2TXOCM5Y','FJHS7MX7W4A6QFOOAESEQBE2','KBHRRNAQIZAD3TWNOXFP64SU','5YNX7AUCT7SD6OIXSFJKVYOL','FXLES7XNQ2NZ6VJLDLZUBP2H','T5QFBXMR6ULNKIITCLKRJBBU','2LC7DE2KXNFWITNK2ZPKYOCE','T4JHOHJBVZLPDAEBSS2WP7J3','BZZSSQEBC7H4FIRIDZW5RBNG','P7RCQP5F5ZDOXUYTV3DGOODI','K56J2HLWGTI2QIZ6MQXVRXRK','ZISEZMWWM3YH525TMCFHMRKN','ZHEE7P4V4AHATHXZIVR3RCGP','TTVUNSMZYAVNF7XYBRKA57JX','IET3NDUZSXW3OJFWEEOHJB2G','LIGD4VPRAXOZKWUX7VDLAHY4','T4C4I7QCJHN6ZFJZCYZ2RHLH','IWQW2CZBUK4UTPYHMPU72I36','EAN4VGKU5WPMHXS63ZFNQ5HR','XDF5KDBPNTNCUNHALL2KJNU3','FPCX2NFRHVPWOYKUHP43VW2V','QCKIQWEOVTGIKPJW23ZWWPTQ','AX563O2VNTXMWP4JZCVBPRNP','P3MMFN5YFRGX7BUYCGJTZHXB','WTEGHXUTNGJDPI2XZD4U5GIJ','JVM3FYLK7LL655AB6UMEND4S','AJYQ6JVNJB4IRWRAQAMOSYEV','E4PK3WQX2W5SDOL4GII4333N','EXABNSLBJ3C337BCBM6EZBO4','3JSLRPQIOCJNALSWOHH4VC6K','4SEZQXT3FNVPEMDTNITUB3HF','DKWHQSQCHKQWMI6XAV6QEENG','X7RWSY2YBZWOH4X2GNUFQ6QM','LCT5YUSLN4Z4BXA4ZJBWET7W','M52IR7YXNSE5ELNTCGSSHQ5T','UV6CSAO2KTZTHVB3TSWJKFNE','RNIVNWWQRW4N2NTIZUL5TTXR','6RA2HLKO27O3TQZKVQS32IAM','N53OIDTGBIEYC6N3H7EP334Z','36J2IWOENIWYTTAQGC7DTZ2D','MSLMB4525ZFPVVPPOKROU6A6','FFR3UJNMBLX35UOSW6RACUVY','JCCRNRRJRG26QI5FLUJZTOML','RXEY4JE3HUUX3DIBJ2BFY7OJ','XKZMFCMCGHYUR2YC3P2WOMY6','D7XR25QWNNQXSJHTKHY3QHWS','QIZSLLO7NE33ST6GVZSAVDUO','ATZUIB3KCRNMSBGSYSZ6CEUT','B2ZYO4OC4GNXOE5OJULNVVLP','FDFKWQNRW3GW7VRNNAPGRG33','FXETSVIK2J7X2EUYHK2ILMOU','ZD4SRNR3FERGKRGS5AB3ABWA','DR6DQ3XZ6KG6X4YMMGBXICUG','XFH5CH2ATV77UMOZJSYCCBP2','DSCFL567QYB7M7QXB2ZROBXW','3KPOARE33OPHG3EWRPZJJLER','AHVPTOGFACT7W5OAGU64F7G4','Y2OXG46SYJNF2RECSI7JN4EC','ML7T5WIQYZO5FHMD4ZH7W2HV','3DY4OLMKKFC5LFGX4QYQT4CB','J2AEOJKXU2GWT33OCUKPXVDX','7Z75ZSHU4PVOMALVGHTLLXX7',
    // 'TXK6LH4JJDLDEDZYZNS3J3FY','Z65MQ55P43NXN6SMZUBPPO7F','VMRDT7U543TBRJUPRCHQNAA7','LNATHGV7WPY6SJZW5AXYJPSJ','YHAIWOKDYLMRDUVZ6FOZJQTQ','TZJ5GVBNIVDVSFSTRWZE6AKH','MWOZB7CQFFQZZWQLGPAAZHXM','P3AYGELI3EEO3LQ4BC4K6CCF','CMBJNIXQHTVVGNHC4ZYOKWTM','MKNGZ2NRO3YZATON3QIYOFBV','XFAC3SS6SF3L4TBNWRIO4CHF','2RUXBDDAFSJENCVPV3GLIJAT','LAFUVQQZULDNSDBIMYHRO5RW','JIBGIJFMB6NTNQJFAP54W54F','GPRQZ6UY2VXPUL32EWYCIMSL','IC5WS3RCCZXXZBBZ7XM5WNDR','2Q2JPHMS44FKR4NCMGITOL44','U7SGPXQUEICL6ETDQZKANWIC','AKNRXCJ7GT2IXLI3TCUREVWR','O5MJP5LR2LTO2V3XJFOBAJSD','2KRPVPLGB2TC4RFFU7JREX4F','RDTV75JKND25MEW7UBS4H75I','GH6ID2QWXSGPNQD5RQQDXB3N','HZ2D7PFACSAMIKQIERRGOBE4','O47JZASYCCSDJ3XHY5PXBQCK','CKEFLXY53VO5JLG54C5JTKID','YVBQIQEVLJ7TNZQHHHHTON3V','U3FWSTUIYAHWOYIDWXNJXANS','NHRROUI7T7NKVIABIRTVD2FP','K6AN7GGYFRDPWPUMDU4KFW5I','X6ASCXGVBR3K2CCT7UBT3XH6','UV7RMDHEA33F3XLU3VWOFO2I','JAAAIWYIFYENWUXF5DG354XA','RVYWSNMJIMJH5CIT6DIHOICB','GKEEXV3BR2Q3IVIMGPVIJ46W','7SM47WY2GL6KOPV4UKY72WJ3','G6RLIUOE25BFY5UTGYHGAT3R','45FXMUZQF4FCK7NHV6DBMEJM','4HER2W3FBUBJG6STUK66QITJ','VEGDSVN3IPX54B6HDZAFY4XL','DRUDA6DPIBS47VEYHK26R2BU','DWN5CSZN4XFZJ6X2SH3IICXR','HI2NKAULU5R55XMB2P5MREQP','SU4R6466A6T23AFLVW7OQGH7','SHCCWEPDQFQ3W67ZSFQ3S7LL','6KRMX2ATLJ2KII3VJ56R2HDG','LLR2SQBMTN5H3WMUCUR5QSBP','DWYA4AJF3U7BDO2ZNTCUUG7W','K5ZKEQMRHJTPUIF2NTUN26TN','PYDZA3ES27THYSUDUNFUJUP3','BMXTGPIKNOSB3V3TJ2FKA26M','5MBGFEJ4TMKD2DH62NGVW7XA','ZFEF3IXMXIPGI7F3LDXGZP3M','H4RWCHFPD5P3BUK47RW7GIOE','6QSD6UX57DG2GXZ7EYCGUFIC','LZOVHOUM2JQHRCUXNSUOMVKA','4OUJWQPS2PJL7TDIAZ22HRO3','AWC7LUP7TLY2FYCSUZA62NPV','JMBPHWK7R57KCDFYGIGYT4UO','L64UF374XAQDTXC5JV7IXJLO','TXOHK3USXPPMNX6Y6I2SUIXF','R7WPIZD56J7CCPTWRO5I5JLF','LMRWS4GPJMYDOBMFNYKWA7WZ','KRZYLWDCOK7JJISLPVLE5KJM','6TG7U6A7WEIOTCSHI3MC32ES','5ENELEMUDLULAIXQWBAM73JM','ETTY7I6ILL2OM7MCEISAJJCI','TM6RYHX274XM4NU53M27VZJB','KKS7LKFNCHGKMTVEPLXZE72J','NPZNQM6LLXQ6D4X2OI6QVBYH','7JLL7NUX3NEXSNBRCS7KBNRY','HSG6I6HQS6S6ZPYC5OZR7CKH','NOIX537OX5QDQRBCDCBMP6SI','73AO7BXRMRPOBQJKRRJHHU52','43FBJI46565AKF5BWV4HHZPB','45MD5DFFAVIMS7DCIIYDWW44','LSZP5DTNEQU62A35JXFA5VR3','55MLOKB6HDOOJRHGYKNUVANK','XO3SWMUI3NQKH4RMEX76FQHD','I25TZQB2NUGLJ6Q4YMEJLX7V','XBAF242LATT4Y6TUGSSNYTPA','MKIXPSW3ISC6GL2R2KCQTTU6','6SVJYYRZHRQWQ7CF7HSR77XP','QJXKDQKBZLOX6NGNZGLGETC4','YUK5PCBU2RGXMUFYKE6XIGFU','2SXMV2MU7VX2GMXELPJB2OXH','KMYGTHUD63BVZCN7NOO7T6HY','ZA2DC55I2MWOJOYHWEHMTM22','3MHGOJXCT6X6Q6UJSU7USSP6','NG2Z3HD4DDIKZBWQF3MKZQWW','KPZRZQFFW3VO2DQXQE7M73ZU','MRNTOYGRSUMWV67TE6VRL4MG','7LA2TEQISHY73TKPDNIWJBLH','S7R4YC6C42URG7G4Q5W5STPG','QNYOIKXI575VXXWN45ZTMBTW','HWUOJWC7REBYKE3TKMXCYE3I','XMA7IMDUKND3RNPCGEWMWK2V','W7GZC7UF6ST5AQHPISY233IR','GKZ5ZPGIS22R2QKGRFEFCHGS','WFNUZ66ERJ5XGGHX6JDQX4W2','HE7ZX5H4MBVD5JU3YJCBPJQ3','DB5O2ESEATZSYDGXMYRPIJ56','TYEVTJOJ4RQYGVCJI2DUCZXQ','VK67ZFQHRAM6P6SHWWSJXXS3','7CXSR5NZJVSB5GEUFJS4NNNH','3HS3L5V2COWXZB7PUPKEPGYZ','EIIXAZH2O24PX37QMPVTRVAX','2PWTVRYW3RTLUABHE3W3OPU3','RENDK7TAM5RBMQRSYZQNWF6G','WK6AJZPH7TRU232F3MQSJGI2','SO4UCJ2HBVFCJ6VSUL24B3TD','N5MX7BI7ZJIQIGT2KDRHYOCZ','JSXVE6Z4ZOGJIFDVEJI6D6PF','GZSO53WKVPHZVIVCFGSQETGM','C7NPNMSMYHI3DAVWA46X6DVP','GP7JNO2G3MVYG223UOQ26722','ED5OZ5PSHN2ARQ6ZDUDXTG57','5MVVVKMDOCFPSS6HYU3DKLGQ','X7WYAHFPX4L7ACA2AQFUR2KD','BPQJP4MU3UPR4AGZDNGZ67NI','EZIDRSJXXKLZ6MCBLCQC7K5Z','BXS2TIWBK33TJELOMAR7LJOX','R5IRRI5YSF66M7ZEM3F5OQFO','H5JGUKX5C4QJQFZTXUPKLRFH','3M2GQM4OSDNCOVEVRGCCFQPC','2XZU5Z4Q7Y672QVFLFQ2USBL','BBS2QOLWLWKMSB6CB6T4XY4X','C2C3YPUC4KCZ2TWLXLVGEZMS','N7J7LZIL5VYVNPYC7E5ZPBVX','Q7N7XWVJYC5GUTJZAM6JDKQR']
    
    let body: BatchDeleteCatalogObjectsRequest = {
        object_ids: ids
    }
    return await api.batchDeleteCatalogObjects(body);
}





export { updateSquare, helper, squareTest, deleteItems };