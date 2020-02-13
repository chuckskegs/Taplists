import { growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader } from "./variables";


// // Constructor: Creates event object
// //////////////
// This is where we add parameters to the object that can be used in the future
// Order Matters
// Make Beer objects from Trello JSON information
const Beer = function (this: any, card: any, customDef: any, index: number) {
    // Checks if index exists (first expression) and then considers the second statement
    !isNaN(index) && (this.tap = (index + 1));
    // (index!)? this.tap = (index + 1): undefined;
    if (card.name.charAt(0) == "_" || card.name.charAt(0) == "-") {
        return;
    }
    let cardCustoms = card.customFieldItems;    
    // if (index == 0) {console.log("Card Customs ", cardCustoms)};
    
    // @ts-ignore
    // console.log("Here: ", customDef[cardCustoms[0].idCustomField].name);
    // Analyze and translate custom field information from Trello Cards
    cardCustoms.map((customInfo: any) => {
        let fieldName = customDef[customInfo.idCustomField].name;
        
        // what does this do again?
        let found = Object.keys(menuHeader).find((key: string) => (menuHeader as any)[key] == fieldName);
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
        // change to ceil when possible
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
    // Set cost based on keg price and ounces received
    beer.costOz = beer["Keg$"] / beer.oz;
    // Set Price per Oz based on markup value
    beer.priceOz = beer.costOz / (markUp as any)[beer.oz];


    // Uses special field to make adjustments to price
    if (beer.Special == "Nitro") {
        // beer.Serving = "16 oz";
        //@ts-ignore
        // this overrides if any nitro serving sizes are other than 20oz. I was told this would never happen but they had 8oz Nitro's for Fort George event (2/7/20)
        beer.price = beer.priceOz * 16 + plusValue[beer.Special];   //<--- add a dollar to nitro?
        // beer.Serving = "20 oz";
    } else {
        //@ts-ignore
        beer.price = beer.priceOz * parseInt(beer.serving) + plusValue[beer.oz];  
    }
    beer.price = Math.max(Math.ceil(beer.price * roundValue)/roundValue, minPrice);
    return beer.price;
};




/////////////////////////// Custom Definition Management \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Recieves array of objects (customField descriptors)
// Returns object with keys [field id] and values [customField info]
const getCustomDefinition = (array: any[]) => {
    let newObj = {};
    // console.log("Custom Field Information: ", array);
    
    // @ts-ignore
    // Creaes an object with custom information
    array.map((obj) => { newObj[obj.id] = new CustomField(obj); });
    // console.log("My Custom Field Object: ", newObj);
    return newObj;
}

// Accepts object representing Trello custom field
// Creates new object with a name field, 
const CustomField = function (this: any, field: any) {

    this.name = field.name;
    this.type = field.type;
    
    // Set options definitions if custom field type is a "list"
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



////////////////////// Exports   ////////////////////////////////////////////////////////////////////

export { Beer, getCustomDefinition };