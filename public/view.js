"use strict";
// Uses data provided to display an HTML table
var _a, _b, _c, _d, _e, _f, _g;
// Costructs page on first load
var initiateTable = function () {
    // Use event object to determine which location to display first
    // -- possibly by URL difference
    // events.then(generateTable);
    // Here
    // generateTable(sampleObj);
    // getData(CD).then(generateTable);
    // myEvents().then(generateTable).catch((err) => alert(err));
    // myEvents(calId).then(generateTable);
};
// "GW Events" onClick
var loadGW = function () {
    // gwEvents().then(generateTable).catch((err) => alert(err));
    // $.get("/cd-taps").then((res) => console.log(`Then me: ${res}`));
    getData(GW).then(generateTable);
};
// "CD Events" onClick
var loadCD = function () {
    // cdEvents().then(generateTable).catch((err) => alert(err));
    getData(CD).then(generateTable);
};
// Rewrites table data
var generateTable = function (data) {
    // Use sample data if none povided
    if (!data) {
        data = sampleData;
    }
    ;
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
            ////vv 
            var eventDetail = obj[key];
            // Create table cells and fill with data
            var cell = document.createElement("td");
            // @ts-ignore // default object data does not have paraemeters? create class/interface?
            // Adds two classes to the cell, could inherit from the parent...
            cell.className = key + " row" + row.rowIndex + " " + obj.type;
            // @ts-ignore
            // This is an example of how to do styling based on some calculation
            // Would extract as a callback if necessary
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
(_a = document.getElementById('CD1')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', loadCD);
(_b = document.getElementById('CD2')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', loadCD);
(_c = document.getElementById('CD3')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', loadCD);
(_d = document.getElementById('CD4')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', loadCD);
(_e = document.getElementById('GW1')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', loadGW);
(_f = document.getElementById('GW2')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', loadGW);
(_g = document.getElementById('Refresh')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', loadGW);
