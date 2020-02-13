//variables

interface menuHeader {
    tap: string;
    beer: string;
    serving: string;
    price: string;
    growler: string;
    origin: string;
    abv: string;
}


// Can be used for header of table:
// Key coordinates with keys in Beer objects, values are for the display to render
// create this based on results of board custom fields? screw up the order?
const menuHeader: menuHeader = {
    tap: "Tap" as string,
    beer: "Beer" as string,
    serving: "Serving" as string,
    price: "Price" as string,
    growler: "Growler" as string,
    origin: "Origin" as string,
    abv: "%ABV" as string,
}
// Determines markup when calculating price based on cost: priceOz = costOz / markUp
// priceOz = costOz / markUp
const markUp = {
    660: .3,
    980: .3,
    1690: .3,
    1984: .3
}
// Determines how much to add at the end (as a base amount): price = priceOz * servingOz + plusValue
// Price = priceOz * Oz + plusValue
const plusValue = {
    "Nitro" : 1,  // Could add more options to "Special" customField in Trello
    660 : .75,  // 1/6 BBL
    980 : .75,  // 1/4 BBL
    1690 : .75, // 50L
    1984 : .75  // 1/2 BBL
}
// Rounding: Calculate prices to the quarter of a dollar [1 => 1.0, 2 => .50, 4 => .25, 10 => .1, etc.]
const roundValue = 4;
// Minimum price for something with alcohol on draft is $5
const minPrice = 5;
// How to get growler price
const growlerCalc = {
  "pintToGrowler" : 2.75,   // Based on price for a pint
  "ozToGrowler" : 44        // Based on cost/oz (if standard size is not 16oz)
} 








// Trello Information
const key = "a211f4aca7fb3e521d652730dd231cb6"; // unknown who this belongs to..chuckskegs@gmail.com?
const token = "ae6ebe60b45abcd2d4aa945c9ab4c4571bd6b6f7856b1df0cd387fbffc649579";
// Location Specific
const GW = {
    locationId : '9ESY9PNCR27FK',           // GW Square Location id
    list : '54ab33ba0fd047932d812777',   // GW Trello Keg List
    // list2 : '5e1f9e54f5719012a69fba14',   // GW Same-Day Trello List
    // list1 : '5e1f9e54f5719012a69fba14',   // GW Same-Day Trello List
    board : '54ab339ee8e7ddb91a778d68'   // GW Trello Board
}
const CD = {
    locationId : 'EX68G9X85NXSX',           // CD Square Location id
    list : '5592b25a535fb4a14dea3bbf',   // CD Trello Kegs List
    // list2 : '5816346a1b9cf1166c582c8d',   // CD Soft Drinks List
    board : '54ab2dc27a5de0dd1a9cd67b'   // CD Trello Board
}




export { CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader, sampleObj };

// /////////////////////////////////
// // basic sample event array
// const sampleData = [
//     ["Monday", "February 10th", "6pm", " ", "7pm", "Event", "Pre-Valentines"],
//     ["Wednesday", "February 12th", "4pm", " ", "9pm", "Food Truck", "Sun's Up Chestnuts"]
// ];

const sampleObj = [
    {   day: "Mon",
        date: "February 9th",
        start: "6pm",
        other: " ",
        end: "7pm",
        type: "Event", 
        title: "Hakunamatata"
    },
    {   day: "Tues",
        date: "February 10th",
        start: "5 pm",
        other: " ",
        end: "7pm",
        type: "Event", 
        title: "Pre-Valentines"
    },
    // ["Wednesday", "February 12th", "4pm", " ", "9pm", "Food Truck", "Sun's Up Chestnuts"]
];

// /////////////////////////////////////////////////////
// ////  Old Variables 
// const range = [2,1,25,9];
// const sheet = "Central District";
// const url = "https://docs.google.com/spreadsheets/d/1hVZQhdkgvqlJ9lowoEoGmrK12x62nKlPcKeaJhN3KSE/edit#gid=0";
// const calH = ["Day", "Date", "Start", " ", "End", "Type", "Event"];
// const tapH = ["Tap", "Beer", "Serving", "Price", "Growler", "Origin", "%ABV"];


// const colorOld = {
//   //light
//   "Pale, IPA": "#4ab200", // light green
//   Cider: "#e5BF00", // yellow
//   "Non Beer": "#2952cc", // blue
//   Sour: "#a82ee5", // purple
//   "Porter, Stout": "#593c00", // brown
//   Wine: "#b21212", // red
//   Event: "#e5457a", // pink
//   undefined: "#9da2a6" // gray
// };
// const color = {
//   //dark
//   "Pale, IPA": "#158000", // light green
//   Cider: "#B39500", // yellow
//   "Non Beer": "#000099", // blue
//   Sour: "#400080", // purple
//   "Porter, Stout": "#5E2F00", // brown
//   Wine: "#B30000", // red
//   Event: "#E600BF", // pink
//   undefined: "#424242" // gray
// };
// const colorDark = {
//   //dark
//   "Pale, IPA": "#0F5C00", // light green
//   Cider: "#786300", // yellow
//   "Non Beer": "#000066", // blue
//   Sour: "#68026B", // purple
//   "Porter, Stout": "#5E2F00", // brown
//   Wine: "#9E0000", // red
//   Event: "#BF009F", // pink
//   undefined: "#3B3B3B" // gray
// };
// const colorLight = {
//   //lightest
//   "Pale, IPA": "#2BFF1C", // light green
//   Cider: "#F7FF00", // yellow
//   "Non Beer": "#26F1FF", // blue
//   Sour: "#FF00F7", // purple [pink] CF87FF
//   "Porter, Stout": "#FFAA00", // brown [orange]
//   Wine: "#FF0000", // red
//   Event: "#FF0000", // pink [red]
//   undefined: "#ffffff" // gray [white]
// };




