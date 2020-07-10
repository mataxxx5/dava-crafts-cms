
const EtsyAPI = require("./drivers/Etsy");

const APIS = [
    // currently only Etsy
    EtsyAPI
];

const createListing = (data) => {
    // let responseStatuses = [];
    APIS.forEach(API => {
        let formattedData = API.formatData(data);
        API.createListing(formattedData);
        // let status = API.createListing(formattedData);
        // responseStatuses.append(status);
    });

    // return responseStatuses
}


module.exports = {
    createListing
}