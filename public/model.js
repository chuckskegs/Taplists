"use strict";
//import { ApiClient } from "square-connect";
// @ts-ignore
var fieldType = {};
// Constructs URL string for http request for card info
var getUrl = function (listId) { return "https://api.trello.com/1/lists/" + listId + "/cards/?customFieldItems=true&key=" + key + "&token=" + token; };
var getListJson = function (list) {
    return $.getJSON(getUrl(list)).then(function (res) { return res; });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Constructor: Creates event object
// //////////////
// This is where we add parameters to the object that can be used in the future
// Order Matters
// Make Beer objects from Trello JSON information
var Beer = function (card, index) {
    var _this = this;
    this.tap = (index + 1);
    if (card.name.charAt(0) == "_" || card.name.charAt(0) == "-") {
        return;
    }
    // if (card.name.indexOf("_")) { return; };
    var cardCustoms = card.customFieldItems;
    if (index == 0) {
        console.log("Card Customs ", cardCustoms);
    }
    ;
    // @ts-ignore
    // console.log("Here: ", customDef[cardCustoms[0].idCustomField].name);
    // Analyze and translate custom field information from Trello Cards
    cardCustoms.map(function (customInfo) {
        // @ts-ignore
        var fieldName = customDef[customInfo.idCustomField].name;
        // let sameName = Object.entries(menuHeader).find(fieldName);
        // console.log(sameName);
        // if () {}
        // @ts-ignore
        // if (Object.values(menuHeader).includes(fieldName))  { 
        var found = Object.keys(menuHeader).find(function (key) { return menuHeader[key] == fieldName; });
        if (found) {
            fieldName = found;
        }
        ;
        // If has "value" property...get the value. Otherwise, use "idValue" to lookup what the value is.
        if (customInfo.value) {
            // @ts-ignore
            // Sets property and value for those fields which DON'T use drop-down menu [text, number, checkbox, etc]
            _this[fieldName] = customInfo.value[Object.keys(customInfo.value)[0]]; // checked = 5d38ec25bc83063847ea4910
        }
        else if (fieldName == "Color") { // "Color" is Trello field for beer type
            // @ts-ignore
            _this.type = customDef[customInfo.idCustomField][customInfo.idValue].value;
            // @ts-ignore
            // assign color to beer to determine display colors
            _this.color = customDef[customInfo.idCustomField][customInfo.idValue].color;
            // @ts-ignore
            // this.color = customDef[customInfo.idCustomField][customInfo.idValue].value;
        }
        else {
            // @ts-ignore
            // Sets property and value for those fields which DO use drop-down menu [list]
            _this[fieldName] = customDef[customInfo.idCustomField][customInfo.idValue].value;
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
    var price = calculatePrice(this);
    // this.growler = `N/A`;
    // Set growler price based on normal price, serving size, size of keg, and cost
    if (this.NoGr) {
        this.growler = "N/A";
    }
    else {
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
};
var calculatePrice = function (beer) {
    //kegPrice, kegSize, servingSize
    // Determine Oz's in keg based on size
    switch (beer["Size"]) {
        case "1/6, 20L, 5.16G":
            beer.oz = 660;
            break;
        case "1/4, 30L, 7.75G":
            beer.oz = 980;
            break;
        case "50L, 13.2G":
            beer.oz = 1690;
            break;
        case "1/2, 58L, 15.5G":
            beer.oz = 1984;
            break;
        default:
            console.log("Unknown Size ", beer.Size);
            break;
    }
    beer.costOz = beer["Keg$"] / beer.oz;
    // Set Price based on markup value
    beer.priceOz = beer.costOz / markUp[beer.oz];
    // copied, need to test
    if (beer.Special == "Nitro") {
        // beer.Serving = "16 oz";
        //@ts-ignore
        // this overrides if any serving sizes are other than 20oz. I was told this would never happen but they had 8oz Nitro's for Fort George event (2/7/20)
        beer.price = beer.priceOz * 16 + plusValue[beer.Special]; //<--- add a dollar to nitro?
        // beer.Serving = "20 oz";
    }
    else {
        //@ts-ignore
        beer.price = beer.priceOz * parseInt(beer.serving) + plusValue[beer.oz];
    }
    beer.price = Math.max(Math.ceil(beer.price * roundValue) / roundValue, minPrice);
    return beer.price;
};
// Custom Field Object ////////////////////////////////////////////
// create customs object with states that can be changed
// and methods like returnCustoms
var getCustomsJson = function (boardId) {
    var url = 'https://api.trello.com/1/boards/'.concat(boardId, '/customFields?key=', key, '&token=', token);
    return $.getJSON(url);
};
// as a Promise?
// let getCustomsJson = new Promise((resolve, reject) => {
//     let url = 'https://api.trello.com/1/boards/'.concat(GW.board, '/customFields?key=', key, '&token=', token);
//     resolve ($.getJSON(url));
// }); 
// Recieves array of objects (customField descriptors)
// Returns object with keys [field id] and values [customField info]
var getCustomDefinition = function (array) {
    var newObj = {};
    console.log("Custom Field Information: ", array);
    // Creaes an object with custom information
    // @ts-ignore
    array.map(function (obj) { newObj[obj.id] = new CustomField(obj); });
    console.log("My Custom Field Object: ", newObj);
    return newObj;
};
// Accepts object representing Trello custom field
// Creates new object with a name field, 
var CustomField = function (field) {
    var _this = this;
    this.name = field.name;
    this.type = field.type;
    // if (field.type == `list`) {
    switch (field.type) {
        case "list":
            field.options.map(function (option) {
                return _this[option.id] = {
                    value: option.value.text,
                    color: option.color
                };
            });
            break;
        case "checkbox":
        //     this.check = true;
        // case `undefined`:
    }
};
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
