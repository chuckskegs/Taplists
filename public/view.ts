// Uses data provided to display an HTML table

// Costructs page on first load
const initiateTable = () => {
    // Use event object to determine which location to display first
    // -- possibly by URL difference
    // events.then(generateTable);
    
    // Here
    // generateTable(sampleObj);
    // getData(CD).then(generateTable);

    // myEvents().then(generateTable).catch((err) => alert(err));
    // myEvents(calId).then(generateTable);
}

// "GW Events" onClick
const loadGW = () => {
    // gwEvents().then(generateTable).catch((err) => alert(err));

    // $.get("/cd-taps").then((res) => console.log(`Then me: ${res}`));
    getData(GW).then(generateTable);

}

// "CD Events" onClick
const loadCD = () => {
    // cdEvents().then(generateTable).catch((err) => alert(err));

    getData(CD).then(generateTable);
}



// Rewrites table data
const generateTable = (data: object[]) => {
    // Use sample data if none povided
    if (!data) { data = sampleData };
    var tBody = document.getElementById("table-body")!; // Expects not null "!"
    tBody.innerHTML = "";
    // console.log(data);
    
    // Take data and look through each object in array
    data.map(obj => {
        let row = document.createElement("tr");
        tBody.appendChild(row);
        
        // Uses menuHeader to determine which fields to include
        Object.keys(menuHeader).map(key => {
            // "as any" removes type error?
            ////vv 
            let eventDetail = (obj as any)[key];

            // Create table cells and fill with data
            let cell = document.createElement("td"); 
            
            // @ts-ignore // default object data does not have paraemeters? create class/interface?
            // Adds two classes to the cell, could inherit from the parent...
            cell.className = `${key} row${row.rowIndex} ${obj.type}`;
            
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
}




// Listeners //
/////////////// ...create these dynamically based on buttons on html page?
// on doc load, check dom for number of <button> elements, create event listeners as needed
// based on "id" or other information from the element?
// -- actually should request that data from the Controller?
document.addEventListener('DOMContentLoaded', initiateTable);
document.getElementById('CD1')?.addEventListener('click', loadCD);
document.getElementById('CD2')?.addEventListener('click', loadCD);
document.getElementById('CD3')?.addEventListener('click', loadCD);
document.getElementById('CD4')?.addEventListener('click', loadCD);
document.getElementById('GW1')?.addEventListener('click', loadGW);
document.getElementById('GW2')?.addEventListener('click', loadGW);
document.getElementById('Refresh')?.addEventListener('click', loadGW);