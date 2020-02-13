"use strict";
// Uses data provided to display an HTML table
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
};
// "GW Events" onClick
var loadGW = function () { $.get("/gw1").then(generateTable); };
// "CD Events" onClick
var loadCD = function () { $.get("/cd1").then(generateTable); };
// Primary Response to Load The App Display
var loadDisplay = function (req) {
    // @ts-ignore: no id on type EventTarget
    // Query parameters to be sent to server-side code
    // Determines data to retrieve by the id of the button pressed
    var query = { menu: req.target.id };
    // extend to use more query information?
    // Http request to express app in Controller.ts
    // Request is for file in same directory root ending in '/data' with the query following a '?'
    $.get("/data", query).then(generateTable);
    // $("#lastRefresh").val("sup");// = Date.now().toLocaleString();
    $("#lastRefresh").text("Last Refresh: " + new Date().toLocaleTimeString()); //toISOString().split('T')[1].split('.')[0]);    
};
// Rewrites table data
var generateTable = function (data) {
    // Use sample data if none povided
    var tBody = document.getElementById("table-body"); // Expects not null "!"
    tBody.innerHTML = "";
    // console.log(data);
    // Take data and look through each object in array
    data.map(function (obj) {
        var row = document.createElement("tr");
        tBody.appendChild(row);
        // Uses menuHeader to determine which fields to include
        Object.keys(menuHeader).map(function (key) {
            // "as any" removes type error?
            var eventDetail = obj[key];
            // Create table cells and fill with data
            var cell = document.createElement("td");
            // @ts-ignore // default object data does not have paraemeters? create class/interface?
            // Adds three classes to the cell, could inherit from the parent...
            cell.className = key + " row" + row.rowIndex + " " + obj.type;
            // @ts-ignore
            // Add styling class based on a condition
            if (obj.serving != "16 oz") {
                cell.className += " differentSize";
            }
            // @ts-ignore
            cell.style.color = obj.color;
            //////////////////////////// class name vvv     
            // console.log(cell.className);
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
(_a = document.getElementById('CD1')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', loadDisplay);
(_b = document.getElementById('CD2')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', loadDisplay);
(_c = document.getElementById('CD3')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', loadDisplay);
(_d = document.getElementById('CD4')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', loadDisplay);
(_e = document.getElementById('CD')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', loadDisplay);
(_f = document.getElementById('GW1')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', loadDisplay);
(_g = document.getElementById('GW2')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', loadDisplay);
(_h = document.getElementById('GW')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', loadDisplay);
(_j = document.getElementById('Refresh')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', function () { return alert("Refreshing..."); }); //lol
