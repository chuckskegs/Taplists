"use strict";
// put variables here?
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Can be used for header of table:
// Key coordinates with keys in Beer objects, values are for the display to render
// create this based on results of board custom fields? screw up the order?
var menuHeader = {
    tap: "Tap",
    beer: "Beer",
    serving: "Serving",
    price: "Price",
    growler: "Growler",
    origin: "Origin",
    abv: "%ABV",
};
// Determines markup when calculating price based on cost: priceOz = costOz / markUp
// priceOz = costOz / markUp
var markUp = {
    660: .3,
    980: .3,
    1690: .3,
    1984: .3
};
// Determines how much to add at the end (as a base amount): price = priceOz * servingOz + plusValue
// Price = priceOz * Oz + plusValue
var plusValue = {
    "Nitro": 1,
    660: .75,
    980: .75,
    1690: .75,
    1984: .75 // 1/2 BBL
};
// Rounding: Calculate prices to the quarter of a dollar [1 => 1.0, 2 => .50, 4 => .25, 10 => .1, etc.]
var roundValue = 4;
// Minimum price for something with alcohol on draft is $5
var minPrice = 5;
// How to get growler price
var growlerCalc = {
    "pintToGrowler": 2.75,
    "ozToGrowler": 44 // Based on cost/oz (if standard size is not 16oz)
};
var customDef = {};
// async works!
function getData(shop) {
    return __awaiter(this, void 0, void 0, function () {
        var listJson, cards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getListJson(shop.list)];
                case 1:
                    listJson = _a.sent();
                    return [4 /*yield*/, getCustomsJson(shop.board).then(getCustomDefinition)];
                case 2:
                    customDef = _a.sent();
                    cards = listJson.map(function (card, index) { return new Beer(card, index); });
                    console.log("cards: ", cards);
                    console.log("get to me last");
                    $.get("/cd-taps").then(function (res) { return console.log("Then me: " + res); });
                    // console.log(`Then Print Me: ${$.get("/cd-taps")}`);
                    return [2 /*return*/, cards];
            }
        });
    });
}
// getData(GW);
// console.log(listJson(GW.list));
//////////////////////////////////////////// Variables.ts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Trello Information
var key = "a211f4aca7fb3e521d652730dd231cb6"; // unknown who this belongs to..chuckskegs@gmail.com?
var token = "ae6ebe60b45abcd2d4aa945c9ab4c4571bd6b6f7856b1df0cd387fbffc649579";
// Location Specific
var GW = {
    locationId: '9ESY9PNCR27FK',
    list: '54ab33ba0fd047932d812777',
    // list2 : '5e1f9e54f5719012a69fba14',   // GW Same-Day Trello List
    // list1 : '5e1f9e54f5719012a69fba14',   // GW Same-Day Trello List
    board: '54ab339ee8e7ddb91a778d68' // GW Trello Board
};
var CD = {
    locationId: 'EX68G9X85NXSX',
    list: '5592b25a535fb4a14dea3bbf',
    // list2 : '5816346a1b9cf1166c582c8d',   // CD Soft Drinks List
    board: '54ab2dc27a5de0dd1a9cd67b' // CD Trello Board
};
/////////////////////////////////
// basic sample event array
var sampleData = [
    ["Monday", "February 10th", "6pm", " ", "7pm", "Event", "Pre-Valentines"],
    ["Wednesday", "February 12th", "4pm", " ", "9pm", "Food Truck", "Sun's Up Chestnuts"]
];
var sampleObj = [
    { day: "Mon",
        date: "February 9th",
        start: "6pm",
        other: " ",
        end: "7pm",
        type: "Event",
        title: "Hakunamatata"
    },
    { day: "Tues",
        date: "February 10th",
        start: "5 pm",
        other: " ",
        end: "7pm",
        type: "Event",
        title: "Pre-Valentines"
    },
];
/////////////////////////////////////////////////////
////  Old Variables 
var range = [2, 1, 25, 9];
var sheet = "Central District";
var url = "https://docs.google.com/spreadsheets/d/1hVZQhdkgvqlJ9lowoEoGmrK12x62nKlPcKeaJhN3KSE/edit#gid=0";
var calH = ["Day", "Date", "Start", " ", "End", "Type", "Event"];
var tapH = ["Tap", "Beer", "Serving", "Price", "Growler", "Origin", "%ABV"];
var colorOld = {
    //light
    "Pale, IPA": "#4ab200",
    Cider: "#e5BF00",
    "Non Beer": "#2952cc",
    Sour: "#a82ee5",
    "Porter, Stout": "#593c00",
    Wine: "#b21212",
    Event: "#e5457a",
    undefined: "#9da2a6" // gray
};
var color = {
    //dark
    "Pale, IPA": "#158000",
    Cider: "#B39500",
    "Non Beer": "#000099",
    Sour: "#400080",
    "Porter, Stout": "#5E2F00",
    Wine: "#B30000",
    Event: "#E600BF",
    undefined: "#424242" // gray
};
var colorDark = {
    //dark
    "Pale, IPA": "#0F5C00",
    Cider: "#786300",
    "Non Beer": "#000066",
    Sour: "#68026B",
    "Porter, Stout": "#5E2F00",
    Wine: "#9E0000",
    Event: "#BF009F",
    undefined: "#3B3B3B" // gray
};
var colorLight = {
    //lightest
    "Pale, IPA": "#2BFF1C",
    Cider: "#F7FF00",
    "Non Beer": "#26F1FF",
    Sour: "#FF00F7",
    "Porter, Stout": "#FFAA00",
    Wine: "#FF0000",
    Event: "#FF0000",
    undefined: "#ffffff" // gray [white]
};
