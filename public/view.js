"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
// Uses data provided to display an HTML table
var menu;
var running = false;
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
// Might slow process down to retrieve from firebase functions
// const header = async () => await $.get("/headers");
// OLD
// Costructs page on first load..?
var initiateTable = function () {
    // Use event object to determine which location to display first
    // Temp for testing...
    // menu = "GW1"
    // loadDisplay();    
};
// "GW Events" onClick
var loadGW = function () { $.get("/gw1").then(generateTable); };
// "CD Events" onClick
var loadCD = function () { $.get("/cd1").then(generateTable); };
// Recieves onClick requests, sets states, and runs regular interval updates
var setMenu = function (req) {
    //@ts-ignore
    menu = req.target.id;
    changeStyles();
    loadDisplay();
    if (!running) {
        running = true;
        window.setInterval(loadDisplay, 30000);
    }
};
var changeStyles = function () {
    var color = (menu.startsWith("CD")) ? '#1134a6' : '#11a618';
    $("#headers").css({ "background-color": color });
};
// Primary Response to Load The App Display
var loadDisplay = function () {
    confirm("All draft beer sales are suspended until further notice in efforts to do our part to help control the spread of Covid-19. \n\nFresh beer can still be found in crowlers canned by the breweries themselves. Stop in Tues-Sat 12pm-8pm for current selection. \n\nStay Healthy!");
    // Query parameters to be sent to server-side code
    // Determines data to retrieve by the id of the button pressed
    var query = { menu: menu };
    // let query = "CD";
    // if (req) {
    //     try {
    //         //@ts-ignore
    //         query = { menu: req.target.id };
    //     } catch (error) {
    //         console.log("error with my query")
    //     }
    // }
    // extend to use more query information?
    // Http request to express app in Controller.ts
    // Request is for file in same directory root ending in '/data' with the query following a '?'
    $.get("/data", query).then(generateTable);
    // $("#lastRefresh").val("sup");// = Date.now().toLocaleString();
    $("#lastRefresh").text("Last Refresh: " + new Date().toLocaleTimeString()); //toISOString().split('T')[1].split('.')[0]);    
};
// Rewrites table data
var generateTable = function (data) {
    if (typeof (data) === "string") {
        alert(data);
    }
    // Use sample data if none povided
    var tBody = document.getElementById("table-body"); // Expects not null "!"
    tBody.innerHTML = "";
    // console.log(data);
    // Take data and look through each object in array
    data.map(function (obj) {
        var row = document.createElement("tr");
        tBody.appendChild(row);
        // @ts-ignore
        // Skip rendering of beers with Placeholder marks
        if (obj.beer.startsWith("-") || obj.beer.startsWith("_")) {
            return console.log("Not Displayed: ", obj);
        }
        // Uses menuHeader to determine which fields to include
        Object.keys(menuHeader).map(function (key) {
            // "as any" removes type error?
            var eventDetail = obj[key];
            // Create table cells and fill with data
            var cell = document.createElement("td");
            // @ts-ignore // default object data does not have paraemeters? create class/interface?
            // Adds three classes to the cell, could inherit from the parent...
            cell.className = key + " row" + row.rowIndex + " " + (obj.type || "Pilsner");
            // @ts-ignore
            // Add styling class to all cells in row based on a condition
            if (obj.serving != "16 oz") {
                cell.className += " differentSize";
            }
            // Set color based on POS color (better feature for new user because they can control color from Trello)
            // cell.style.color = obj.color; --important?
            // if (eventDetail == "NaN") {alert(`${obj.beer}`)}
            // Changed: Empty cell if value of zero (string or integer)
            // Helps with CSS styling
            if (eventDetail === 0 || eventDetail === "0") {
                eventDetail = ""; // empty so that CSS can make formatting changes
                // eventDetail = "N/A";
            }
            cell.textContent = eventDetail;
            row.appendChild(cell);
        });
        // removed 2/5/20... moved to top
        // tBody.appendChild(row);
    });
};
// Listeners //
/////////////// ...create these dynamically based on buttons on html page?
// on doc load, check dom for number of <button> elements, create event listeners as needed
// based on "id" or other information from the element?
// -- actually should request that data from the Controller?
document.addEventListener('DOMContentLoaded', initiateTable);
(_a = document.getElementById('CD1')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', setMenu);
(_b = document.getElementById('CD2')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', setMenu);
(_c = document.getElementById('CD3')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', setMenu);
(_d = document.getElementById('CD4')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', setMenu);
(_e = document.getElementById('CD')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', setMenu);
(_f = document.getElementById('GW1')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', setMenu);
(_g = document.getElementById('GW2')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', setMenu);
(_h = document.getElementById('GW3')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', setMenu);
(_j = document.getElementById('GW')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', setMenu);
(_k = document.getElementById('Refresh')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', function () { alert("Refreshing...I do this every 30 seconds"); loadDisplay; }); //lol
