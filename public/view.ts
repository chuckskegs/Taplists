// Uses data provided to display an HTML table


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

// Might slow process down to retrieve from firebase functions
// const header = async () => await $.get("/headers");

// OLD
// Costructs page on first load..?
const initiateTable = () => {
    // Use event object to determine which location to display first

}
// "GW Events" onClick
const loadGW = () => { $.get("/gw1").then(generateTable); }
// "CD Events" onClick
const loadCD = () => { $.get("/cd1").then(generateTable); }


// Primary Response to Load The App Display
const loadDisplay = (req: MouseEvent) => { 
    // @ts-ignore: no id on type EventTarget
    // Query parameters to be sent to server-side code
    // Determines data to retrieve by the id of the button pressed
    let query = { menu: req.target.id };
    // extend to use more query information?
    
    // Http request to express app in Controller.ts
    // Request is for file in same directory root ending in '/data' with the query following a '?'
    $.get(`/data`, query).then(generateTable);
    // $("#lastRefresh").val("sup");// = Date.now().toLocaleString();
    $("#lastRefresh").text(`Last Refresh: ${new Date().toLocaleTimeString()}`);//toISOString().split('T')[1].split('.')[0]);    
};



// Rewrites table data
const generateTable = (data: object[]) => {
    // Use sample data if none povided
    var tBody = document.getElementById("table-body")!; // Expects not null "!"
    tBody.innerHTML = "";
    // console.log(data);
    
    // Take data and look through each object in array
    data.map(obj => {
        let row = document.createElement("tr");
        tBody.appendChild(row);
        // @ts-ignore
        // Skip rendering of beers with Placeholder marks
        if (obj.beer.startsWith("-") || obj.beer.startsWith("_")) {
            return console.log("Not Displayed: ", obj); 
        }
        // Uses menuHeader to determine which fields to include
        Object.keys(menuHeader).map(key => {
            // "as any" removes type error?
            let eventDetail = (obj as any)[key];

            // Create table cells and fill with data
            let cell = document.createElement("td"); 
            
            // @ts-ignore // default object data does not have paraemeters? create class/interface?
            // Adds three classes to the cell, could inherit from the parent...
            cell.className = `${key} row${row.rowIndex} ${obj.type}`;
            
            // @ts-ignore
            // Add styling class to all cells in row based on a condition
            if (obj.serving != "16 oz") {
                cell.className += " differentSize";
            }
            // @ts-ignore
            cell.style.color = obj.color;
       //////////////////////////// class name vvv     
            // console.log(cell.className);
            // Read "N/A" if growler price is 0
            if (eventDetail === 0) {
                eventDetail = "N/A";
            }
            cell.textContent = eventDetail;
            row.appendChild(cell);
        });
        // removed 2/5/20... moved to top
        // tBody.appendChild(row);
    });
}




// Listeners //
/////////////// ...create these dynamically based on buttons on html page?
// on doc load, check dom for number of <button> elements, create event listeners as needed
// based on "id" or other information from the element?
// -- actually should request that data from the Controller?
document.addEventListener('DOMContentLoaded', initiateTable);
document.getElementById('CD1')?.addEventListener('click', loadDisplay);
document.getElementById('CD2')?.addEventListener('click', loadDisplay);
document.getElementById('CD3')?.addEventListener('click', loadDisplay);
document.getElementById('CD4')?.addEventListener('click', loadDisplay);
document.getElementById('CD')?.addEventListener('click', loadDisplay);
document.getElementById('GW1')?.addEventListener('click', loadDisplay);
document.getElementById('GW2')?.addEventListener('click', loadDisplay);
document.getElementById('GW')?.addEventListener('click', loadDisplay);
document.getElementById('Refresh')?.addEventListener('click', ()=>alert("Refreshing..."));//lol