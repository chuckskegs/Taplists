// import {  } from "./variables";
import { CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader, sampleObj } from "./variables";

const fieldType = {
    
}
// Declare so can created once and shared?
// let customDef = {};


// Constructs URL string for http request for card info
const getUrl = (listId: string) => `https://api.trello.com/1/lists/${listId}/cards/?customFieldItems=true&key=${key}&token=${token}`;
const getListJson = (list: string) => { console.log("hey"); return "hi there"};
    // $.getJSON(getUrl(list)).then(res => res).catch((err) => err);





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Constructor: Creates event object
// //////////////
// This is where we add parameters to the object that can be used in the future
// Order Matters
// Make Beer objects from Trello JSON information
const Beer = function (this: any, card: any, index: number) {
    this.tap = (index + 1);
    if (card.name.charAt(0) == "_" || card.name.charAt(0) == "-") {
        return;
    }
    // if (card.name.indexOf("_")) { return; };
    let cardCustoms = card.customFieldItems;
    
    if (index == 0) {console.log("Card Customs ", cardCustoms)};
    
    // @ts-ignore
    // console.log("Here: ", customDef[cardCustoms[0].idCustomField].name);
    // Analyze and translate custom field information from Trello Cards
    cardCustoms.map((customInfo: any) => {
        // @ts-ignore
        let fieldName = customDef[customInfo.idCustomField].name;
        // let sameName = Object.entries(menuHeader).find(fieldName);
        // console.log(sameName);
        
        // if () {}
        // @ts-ignore
        // if (Object.values(menuHeader).includes(fieldName))  { 
        let found = Object.keys(menuHeader).find((key) => menuHeader[key] == fieldName);

        if (found) {fieldName = found};
        

        // If has "value" property...get the value. Otherwise, use "idValue" to lookup what the value is.
        if (customInfo.value) {
            // @ts-ignore
            // Sets property and value for those fields which DON'T use drop-down menu [text, number, checkbox, etc]
            this[fieldName] = customInfo.value[Object.keys(customInfo.value)[0]];     // checked = 5d38ec25bc83063847ea4910
        } else if (fieldName == "Color") { // "Color" is Trello field for beer type
            // @ts-ignore
            this.type = customDef[customInfo.idCustomField][customInfo.idValue].value;       
            // @ts-ignore
            // assign color to beer to determine display colors
            this.color = customDef[customInfo.idCustomField][customInfo.idValue].color;
            
            // @ts-ignore
            // this.color = customDef[customInfo.idCustomField][customInfo.idValue].value;
        } else {
            // @ts-ignore
            // Sets property and value for those fields which DO use drop-down menu [list]
            this[fieldName] = customDef[customInfo.idCustomField][customInfo.idValue].value; 
        }
        return customInfo;
    });

    
    // Overrides and Defaults:
    this.beer = card.name;
    // Default to 16oz serving size
    if (!this.serving) {
        this.serving = "16 oz";
    }
    // this.price = this["Keg$"];
    // Calculates price based on keg size, keg cost, and serving size
    let price = calculatePrice(this);
    price * 2; //temp
    // this.growler = `N/A`;
    // Set growler price based on normal price, serving size, size of keg, and cost
    if (this.NoGr) {
        this.growler = `N/A`;
    } else {
        this.growler = Math.ceil(this.priceOz * growlerCalc.ozToGrowler);
    }

    // // If already has a property, also assign to correct property name
    // Object.keys(menuHeader).map((header) => {
    //     //@ts-ignore
    //     // If custom field name matches one of the values from menuHeader
    //     if ((this as any)[menuHeader[header]]) {
    //         //@ts-ignore
    //         console.log(header, menuHeader[header]); 
    //         //@ts-ignore
    //         this[header] = this[menuHeader[header]]
    //     }
    // });
}





const calculatePrice = (beer: any) => {
    //kegPrice, kegSize, servingSize
    // Determine Oz's in keg based on size
    switch (beer["Size"]) {
        case `1/6, 20L, 5.16G`:
            beer.oz = 660;
            break;
        case `1/4, 30L, 7.75G`:
            beer.oz = 980;
            break;
        case `50L, 13.2G`:
            beer.oz = 1690;
            break;
        case `1/2, 58L, 15.5G`:
            beer.oz = 1984;
            break;
        default:
            console.log("Unknown Size ", beer.Size);
            break;
    }
    beer.costOz = beer["Keg$"] / beer.oz;
    // Set Price based on markup value
    beer.priceOz = beer.costOz / (markUp as any)[beer.oz];


    // copied, need to test
    if (beer.Special == "Nitro") {
        // beer.Serving = "16 oz";
        //@ts-ignore
        // this overrides if any serving sizes are other than 20oz. I was told this would never happen but they had 8oz Nitro's for Fort George event (2/7/20)
        beer.price = beer.priceOz * 16 + plusValue[beer.Special];   //<--- add a dollar to nitro?
        // beer.Serving = "20 oz";
        
    } else {
        //@ts-ignore
        beer.price = beer.priceOz * parseInt(beer.serving) + plusValue[beer.oz];
        
    }
    beer.price = Math.max(Math.ceil(beer.price * roundValue)/roundValue, minPrice);
    
    
    return beer.price;
};








// Custom Field Object ////////////////////////////////////////////

// create customs object with states that can be changed
// and methods like returnCustoms
const getCustomsJson = (boardId: string) => {
    let url = 'https://api.trello.com/1/boards/'.concat(boardId, '/customFields?key=', key, '&token=', token);
    return $.getJSON(url);
}; 
// as a Promise?
// let getCustomsJson = new Promise((resolve, reject) => {
//     let url = 'https://api.trello.com/1/boards/'.concat(GW.board, '/customFields?key=', key, '&token=', token);
//     resolve ($.getJSON(url));
// }); 

// Recieves array of objects (customField descriptors)
// Returns object with keys [field id] and values [customField info]
const getCustomDefinition = (array: any[]) => {
    let newObj = {};
    console.log("Custom Field Information: ", array);
    
    // Creaes an object with custom information
    // @ts-ignore
    array.map((obj) => { newObj[obj.id] = new CustomField(obj); });
    console.log("My Custom Field Object: ", newObj);
    return newObj;
}

// Accepts object representing Trello custom field
// Creates new object with a name field, 
const CustomField = function (this: any, field: any) {

    this.name = field.name;
    this.type = field.type;
    
    // if (field.type == `list`) {
    switch (field.type) {
        case `list`:
            field.options.map((option: any) => 
                this[option.id] = {
                    value: option.value.text,
                    color: option.color
                });
            break;
        case `checkbox`: 
            
        //     this.check = true;
        // case `undefined`:

            
    }


}
/*
{
5d38ec25bc83063847ea490c: "Size",
5d38ec518206f9580fe0c2d1: "Keg$",
5d38ec640b0fd97a06599fd9: "Origin",
5d38ecad5ce5b65075ead734: "Color",
5d38eccadc85c34e2612307c: "Special",
5d38ecdd10b9290bb15fafca: "%ABV",
5d38ece8f4c30a1e94cdb292: "Serving",
5d38ed61e08e962c5520afe2: "NoGr",
5e307ea4ffc3516ce293ee93: "$Override",
}

|
to
|
v

{
    5d38ec25bc83063847ea490c: { 
        name: "Size",
        5d38ec25bc83063847ea4910: {
            value: "1/2, 58L, 15.5G",
            color: "Green" }
        5d38ec25bc83063847ea490f: {
            value: "50L, 13.2G",
            color: "Yellow" }
        5d38ec25bc83063847ea490e: {
            value: "1/4, 30L, 7.75G",
            color: "Pink" }
        5d38ec25bc83063847ea490d: {
            value: "1/6, 20L, 5.16G",
            color: "Blue"}
    }
    5d38ec518206f9580fe0c2d1: "Keg$",
    5d38ec640b0fd97a06599fd9: "Origin",
    5d38ecad5ce5b65075ead734: "Color",
    5d38eccadc85c34e2612307c: "Special",
    5d38ecdd10b9290bb15fafca: "%ABV",
    5d38ece8f4c30a1e94cdb292: "Serving",
    5d38ed61e08e962c5520afe2: "NoGr",
    5e307ea4ffc3516ce293ee93: "$Override",
}

*/











////////////////////// Exports   ////////////////////////////////////////////////////////////////////

export { Beer, getCustomDefinition, getCustomsJson, fieldType, getListJson };