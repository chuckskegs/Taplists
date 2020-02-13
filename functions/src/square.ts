
import { CatalogApi, ApiClient } from 'square-connect';

const defaultClient = ApiClient.instance;
const accessToken = "Bearer EAAAEAc8bQK1bCNQkoHHHqSlwIAiy2gEB-g8EtRqX0EVkYOlITOo_2yeZLsdEgS1"
// const client_id = "sq0idp-GNJz38YO42bc95-iOPHyLQ"; // application id
// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = accessToken;

const api = new CatalogApi();
api.listCatalog().then().catch();


// // For Sandbox Mode
// import SquareConnect from 'square-connect';
// var defaultClient = SquareConnect.ApiClient.instance;
// // Set sandbox url
// defaultClient.basePath = 'https://connect.squareupsandbox.com';
// // Configure OAuth2 access token for authorization: oauth2
// var oauth2 = defaultClient.authentications['oauth2'];
// // Set sandbox access token
// oauth2.accessToken = "YOUR SANDBOX ACCESS TOKEN";
// // Pass client to API
// var api = new SquareConnect.LocationsApi();




















// // Firebase: 
// // var config = {
// //     apiKey: "",
// //     authDomain: "",
// //     databaseUrl: ""
// // }
// // firebase.intializeApp(config);
// // var rootRef = firebase.database().ref();

// console.log("iloadedme");







// const api = new SquareConnect.LocationsApi();

// api.listLocations().then((data: any) => {
//     // @ts-ignore
//     console.log("API called successfully. Returned data: " + JSON.stringify(data, 0, 1));
// }, (error: any) => {
//     console.error(error);
// });
