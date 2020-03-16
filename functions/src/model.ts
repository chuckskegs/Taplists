// My Variables
import { Shop, CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader } from "./variables";
// Http request-sending node module to communicate with Trello and Square
import http, { AxiosResponse, AxiosError } from 'axios';  // - need to use response.data to access the information



/**
 * asynchronized!
 * Returns current taplist data based on query parameter provided
 * @param {string} menu The query selecting which data to retrieve
 * @example `GW` | `CD` Returns entire list
 */
async function getData (menu: string, myList?: string) {
    try {
        // Identifies shop and list to display from the menu query parameter
        // Checks if starts with GW such as GW1, GW2, etc. and set's shop value accordingly
        let shop = menu.startsWith('GW') ? GW : CD;
        let list = shop.list;
        
        // Set list if parameter provided
        if (myList) {list = myList};
        

        ////// Filter for Screen \\\\\\
        // Use redux to extract number from query
        // let list = menu.replace( /^\D+/g, '');
        let screen: number = parseInt(menu.charAt(2));
        let start;
        let end;
        // console.log(`Data for: ${screen} ${list} ${Date.now()}`);
        
        // Reduce Deck size based on screen to be displayed
        // Hopefully could be replaced with a CSS option
        switch (screen) {
            case 1:
                // start = 0;
                end = 25;
                break;
            case 2:
                start = 25;
                // end = 50;
                break;
            case 3:
                // start = 0;
                list = shop.list2;         
                break;    
            default:
                // Use all the cards when number not included: ex. for Square and mobile view (hint: because button id doesn't have number associated)
                break;
        }
    
        // ...getUrl to be modified to support limited cards? or just filter deck after...
        let getUrl = (listId: string) => `https://api.trello.com/1/lists/${listId}/cards/?customFieldItems=true&key=${key}&token=${token}`;
        // Use axios to synchronously get JSON from apropriate list using async/await
        // let jsonDeck: Array<JSON> = await (await http.get(getUrl(list))).data; 
        let jsonDeck: Array<JSON> = await http.get(getUrl(list)).then((res: AxiosResponse) => res.data).catch((err: AxiosError) => console.log(`My Deck Error: ${err.message}`));


        // Synchronously retrieves custom definition data from Trello
        let url = () => `https://api.trello.com/1/boards/${shop.board}/customFields?key=${key}&token=${token}`;
        // let customDef = getCustomDefinition(await (await http.get(url())).data);
        let customDef = await http.get(url()).then((res: AxiosResponse) => getCustomDefinition(res.data)).catch((err: AxiosError) => console.log(`My Customs Error: ${err.message}`));


        // Creates an array of Beer objects 
        // Looks at each card from Trello and creates Beer objects using the definitions made
        let cards = jsonDeck.map((card: any, index: number) => new (Beer as any)(card, customDef, shop, index));

        // // Reduce Deck size based on screen to be displayed
        // // Could be replaced with a CSS option
        cards = cards.slice(start, end);
        return cards;
    } catch { 
        console.log("Problem Getting Data...");
        return "Problem Getting Data..."
    }
}


/** @description
  * This is where we add properties to the object that can be used in the future.
  * Order Matters.
  * Make Beer objects from Trello JSON information.
  * @param {object} card The json object representing Trello card
  * @param {object} customDef The definitions object created
  * @param {number} index [Optional] The current index in array
  * @todo Refactor to class
  */ 
 const Beer = function (this: any, card: any, customDef: any, shop: Shop, index: number) {
    // (index!)? this.tap = (index + 1): undefined;
    // Checks if index exists (first expression) and then considers the second statement
    !isNaN(index) && (this.tap = (index + 1));
     
    if (!card.name) {console.log("no name :", card)}
    this.beer = card.name;
    
    // Set shop name to beer object for reference
    if (!shop.name) {console.log("no shop :", card)}
    this.shop = shop.name;

    let cardCustoms = card.customFieldItems;    
    
    // @ts-ignore
    // Analyze and translate custom field information from Trello Cards
    cardCustoms.map((customInfo: any) => {
        if (!customInfo) { return "Error making customs"}
        let fieldName = customDef[customInfo.idCustomField].name;
        
        // If there is a Value in menuHeader with same name, apply the name of the Key instead (ex. "%ABV" => "abv")
        const found = Object.keys(menuHeader).find((title: string) => (menuHeader as any)[title] === fieldName);
        if (found) {fieldName = found};
        

        // If has "value" property...get the value. Otherwise, use "idValue" to lookup what the value is.
        if (customInfo.value) {
            // @ts-ignore
            // Sets property and value for those fields which DON'T use drop-down menu [text, number, checkbox, etc]
            this[fieldName] = customInfo.value[Object.keys(customInfo.value)[0]];     // checked = 5d38ec25bc83063847ea4910
        } else if (fieldName === "Color") { // "Color" is Trello field for beer type
            this.type = customDef[customInfo.idCustomField][customInfo.idValue].value;       
            // assign color to beer to determine display colors
            this.color = customDef[customInfo.idCustomField][customInfo.idValue].color;
            // this.color = customDef[customInfo.idCustomField][customInfo.idValue].value;
        } else {
            // Sets property and value for those fields which DO use drop-down menu [list]
            this[fieldName] = customDef[customInfo.idCustomField][customInfo.idValue].value; 
        }
        return customInfo;
    });

    // Overrides and Defaults:
    // Default to 16oz serving size
    if (!this.serving) {
        this.serving = "16 oz";
    }
    // this.price = this["Keg$"];
    // Calculates price based on keg size, keg cost, and serving size
    this.price = calculatePrice(this);

        // if (!this.Size) {console.log(this.price);}

    // price * 2; //temp
    // this.growler = `N/A`;
    // Set growler price based on normal price, serving size, size of keg, and cost
    if (this.NoGr) {
        this.growler = 0;
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





/**
 * Uses Beer object properties to determine price calculation
 * @param { Object } Beer Object with beer data
 * @property { Object } Size required on Beer object
 * @returns { number } Price
 */
const calculatePrice = (beer: any) => {
    // if (!beer.Size) {return}
    // Determine Oz's in keg based on keg size
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
            break;
    }
    // Set cost based on keg price and ounces received
    beer.costOz = beer["Keg$"] / beer.oz;
    // Set Price per Oz based on markup value [separately determined by keg size]
    beer.priceOz = beer.costOz / (markUp as any)[beer.oz];


    // Uses "Special" field from Trello to make adjustments to price
    if (beer.Special === "Nitro") {
        //@ts-ignore
        // This overrides if any nitro serving sizes are other than 20oz. They had 8oz Nitro's for Fort George event (2/7/20)
        beer.price = beer.priceOz * 16 + plusValue[beer.Special];   //<--- add a dollar to nitro
    } else {
        //@ts-ignore
        // Set price price based on serving size, price per oz, and additional base price (plusValue)
        beer.price = beer.priceOz * parseInt(beer.serving) + plusValue[beer.oz];  
    }

    // Round up [to nearest quarter ($0.25)] 
    beer.price = Math.ceil(beer.price * roundValue)/roundValue;

    // If alcoholic, don't let it be less than the minimum price allowed [$5.00]
    beer.price = (beer.abv) ? beer.price : Math.max(beer.price, minPrice);

    // if (!beer.Size && !beer[`$Override`]) {console.log("no override: ", beer.beer);}


    // If override value exists (from Trello) return that value istead of normal price calculation
    return (!beer[`$Override`]) ? beer.price : beer[`$Override`] | 0;
    // return beer[`$Override`] || beer.price;  
};







/////////////////////////// Custom Definition Management \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ 
/** 
 * Recieves array of objects (customField descriptors)
 * Returns object with keys [field id] and values [customField info]
 * @param {array} jsonArray
 */
const getCustomDefinition = (array: any[]) => {
    let newObj = {};
    // console.log("Custom Field Information: ", array);
    
    // @ts-ignore
    // Creaes an object with custom information
    array.map((obj) => { newObj[obj.id] = new CustomField(obj); });
    // console.log("My Custom Field Object: ", newObj);
    return newObj;
}



/**
 * Accepts object representing Trello custom field
 * Creates new object with a name field directing to values
 * @todo convert to a class
 */
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

export { getData, Beer, getCustomDefinition };