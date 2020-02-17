//variables

////////////////////  Interface  \\\\\\\\\\\\\\\\\\\\\\\
// Trial1
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
const menuHeader = {
    tap: "Tap",
    beer: "Beer",
    serving: "Serving",
    price: "Price",
    growler: "Growler",
    origin: "Origin",
    abv: "%ABV",
}



//////////////////////////   Pricing  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

// How to calculate growler price
const growlerCalc = {
  "pintToGrowler" : 2.75,   // Based on price for a pint
  "ozToGrowler" : 44        // Based on cost/oz (if standard size is not 16oz)
} 










/////////////////////////// Trello Information  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const key = "a211f4aca7fb3e521d652730dd231cb6"; // unknown who this belongs to..chuckskegs@gmail.com?
const token = "ae6ebe60b45abcd2d4aa945c9ab4c4571bd6b6f7856b1df0cd387fbffc649579";
// Location Specific
const GW = {
    locationId : '9ESY9PNCR27FK',            // GW Square Location id
    list : '54ab33ba0fd047932d812777',       // GW Trello Keg List
    list2 : '5e1f9e54f5719012a69fba14',      // GW Same-Day Trello List
    // list1 : '5e1f9e54f5719012a69fba14',   // GW Same-Day Trello List
    board : '54ab339ee8e7ddb91a778d68',      // GW Trello Board
    categoryId : 'asdf'
}
const CD = {
    locationId : 'EX68G9X85NXSX',           // CD Square Location id
    categoryId : 'SN2VHQBZJGUYI5VKAJPGQUGA', // "Draft CD" Square category
    list : '5592b25a535fb4a14dea3bbf',      // CD Trello Kegs List
    list2 : '5816346a1b9cf1166c582c8d',     // CD Soft Drinks List
    board : '54ab2dc27a5de0dd1a9cd67b',     // CD Trello Board
}









//////////////////////////// Square \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const square = {
    clientId: "sq0idp-GNJz38YO42bc95-iOPHyLQ",
    accessToken: "EAAAEAc8bQK1bCNQkoHHHqSlwIAiy2gEB-g8EtRqX0EVkYOlITOo_2yeZLsdEgS1",
    sandboxToken: "EAAAEAXy7GnOyfpJgrgzoLY9PGaVgro8Qxnzl3AHj_pCV7oYIYCs_XXR18Hn9b8x",
    gwLocation: "9ESY9PNCR27FK",
    cdLocation: "EX68G9X85NXSX",
    testIds: ["FKOSQQ4UAIAOQEMFIFD75LBN"],
    gwIds: ["IITFQUSGJIEHTB2E6IGLKF53", "QTZGYYRXTLEGZF3Y6T6KZSXW", "J3N52PBXXNGNPYF7GEP3FT54", "IEHB5LIG6LLRI3NTOD3ICTAV", "FK5QYQEYF2IOFWTVGTZUK424", "KLINBA6WNNKDJK2RK45BPWH6", "PF2LBJC6EDRQLKVXXZBCSKVP", "H5FIVIPGO5BG6QPY3BTLUZD2", "MGUXUJYLZXJLMGWW7XE2FXKT", "NRKPMB3JURTVTWVVQUKKSKKK", "5P656ZFLMFL7QHESJGOXQN3X", "TMJ2GZGVWSSL3FDP22M3DOYE", "LR2OZ2SIOQSNPYPRF2GZXV2L", "VLK6DBMMP5B56ANXNZ2ZEDMT", "Q5SCHJ3GPWNTVTSRJ4IP4QGT", "BJ75IODUGRNF4H3EATUGMI62", "CIUFQIZJEGEA6Z6VXUIBVU7Y", "6CJKRPOPUC22OKCXPR5HM27J", "352PRFWTEG5R2UUUISY5V5EV", "NVQ4CTYW6EBP7EUGLS3PNUVQ", "PRXLI7RZHKN7WT2LE5BN5CMQ", "AYS6ZFZSVR4L4YR7FOKDLAOP", "W3G3OGENIMTT4K7E5JE5WKUX", "GVBVYEZQS5H23NZOHBD2RZKX", "EOMYADM2ZJZVJ2ENBMGWKHX6", "LR27SWZNQWYRP2UAVD4JEPDZ", "7IOKBYMVUDDWJLZVAOFXSN65", "7TPRLEJA2X2D44LOTSWVRDBN", "EZP55IH7LUOGX4DIG4CKSIKG", "EWEEA57MGLWTC4HYV6AOC3FK", "BTN5UKTXY2ZZFUXXHJMFPKZT", "M5ICCWORS5PA556WKXBOPORT", "BRPJOHF24DZSOXGKXFQPKBZ4", "CTUS7VY4BSDPB3U5PQZYYFGP", "F6PPPL4TY5JBP6MLCCF4ULV7", "VF6AF6IYEQS36R4FFMKPLFMH", "XEMAG5E3N5ERO3USLYJB5FLM", "FRCOSXI2FTYAVDHX5C2IJY6P", "TX6WK4ANPDQN4B2IPLTC4IPT", "3R2RALOPBFNTY6DHXDHG2YDI", "GXRKOB5ARPE4TIMTRGSATOVA", "XAFSN6UZWZDIAYPE6A3OCRHC", "6OK3AZ66TQOONHEPHBXPXETK", "PCMJA62GL3A3JOPNRQWQ6EUG", "C32UH56DAIESAXR2UK62S5S4", "2SGQB5WHCKH2VRHWGOOIBMP7", "4B5PTT6HHENKECVWOE444IH2", "PIF5KRZUJGKFUNRBWSY3GP2N", "RXSL3BEBNJCJ37XZKTPCCYNG", "4IYBUIDZ5AYUBMHA5US253C6"],
    cdIds: ["523O3VV4E63B3ZWEDKCYZIUO", "YCE5PAU5UU3CYJHEBW2UPL6E", "27LPZYFKLZCDNIKL3ECELMQH", "JBZDVZ7LR6Z5C47PNTOIVGXZ", "TAKDCWF6M54YY2S3SGB4BP2V", "ONXJMSCMVQ766I6VMPLLHJ53", "O5HJDKLWR6Q3VJD5SHWD7IEP", "43WD4HEEKGGJIFRRINP36CRN", "B6TC2L6B7SHXSXG5LSJFOPPD", "5WPXQARF4O7XDCC6WAJXMDLQ", "PQJ5SQD7ETPYDDA3HCHL7DL2", "MXCFDM5FRUEXHGDQDQN6OBF6", "K6M2ZI7YVTA3IZLXLXCHRL4R", "6CH255HOECKZYTBUYCHMOWO5", "EO6VXD6Y7ZCCUDOARIGFA475", "YHHKKZAD56VWCBCKHKEQIBMT", "IT7EVK2N2ECHYXVN7NFFZ47I", "ADITFVLCRJWEFESY2N3UKCDG", "BNHG7JVYYYIMH7Q4OPB7Z3IT", "UX47HF2NUEZK25RZXI266PHY", "G3N6ATCHHDRP2ZFF7X673VLC", "GGAXK2X6E7QNR6EPLON7KLKC", "HM2BODX55QURHW4KIAHY4HME", "SJXHO4MR2XLGVOBI7V6RS4G5", "ZYA2SUR5P74UJI2XAUEIQRKF", "WUVOEQVWXNGEEXMYEBWFILFJ", "VUXZYS3CJ4TRCIYS3O2WG4K7", "UGG4ELC7PNQOG6CWR2E26OKT", "UUMNSLUJJP2B5U4XU6NEXWLT", "UXBDIV7JFVORE7M37DYCVCKC", "S6UMNQ6TI54NNCV5DCSZ3LM4", "DM6G5HD37O3QH2FLEYMTQKVY", "W3BEO6RI3WV46THSTY5TPS6P", "RPLVZYSR6N5VI5MMEG2C7O64", "XTR23XX4OFGA6JJ63R7Z4CO4", "KNILES27WPMDZEZ5YWKV32WA", "GRGPVLKCZUD2TDWXULPOYOAV", "GP5K5B6LTCQNCTFBVWYIGKKL", "YXHWAP5HZDH43GZZ43IERFSF", "CM3HJD4ESO7SOY77OIWV5WJS", "JVMXHUB4DUOP6XSSH6F3DJUU", "5RUB4NBT46JWZW5LCWIIWE3C", "ZWQQBFYM5K34NC3VXF6JJP7H", "WKGN6VGD6DPDFD5KBJD4VZTG", "54CKZXB32QRQNWTWHT4TVYPC", "KNXBLNYT6SDKSFH7UKJEBOTG", "2NAYVLFE3SG6JOS44LI6JBSA", "MTZV7BYLEVNA6EAWPCMU72MI", "3AQSMOBLWSMKQTMGIGRSGELF", "NUWHYQSSDJEQD4NJOHQWM762"],
    cdIds2: ["AL5MTFLZCNEJOVDZ6VASMLVJ", "N4TXBN6FJK4KKWSX5LP67QTF", "IEOTCWP7BFG55AKOLDQ5GAXY", "QRVL4EQHHKHMOSGNQ5DJQBM6", "CHJ7O6PD7UAURRJCRR3LHFZI", "AVRRKIWYYTILA6GHUAXGZCYF", "2XU7GV4WKXIB35SZULXDBIF6", "5FI3NXVQ6UNX6WDZ5QJBOBMN", "2HYIUGFY7GEL7B63MXRP7GF7", "PKXZIANVAJISGMC3T72WNEVR", "42UR2AWIHAWPOHH4SB57CMXC", "R3754J4K2BQ7IA62MTXBXMHB"]
}




export { CD, GW, key, token, growlerCalc, minPrice, roundValue, plusValue, markUp, menuHeader, sampleObj, square };

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




