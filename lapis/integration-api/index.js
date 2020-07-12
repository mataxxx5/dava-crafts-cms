
const EtsyAPI = require("./drivers/Etsy");

const APIS = [
    // currently only Etsy
    EtsyAPI
];

const createListing = async (data) => {
   
    let apiRes = await APIS.map(async API => {
        let formattedData = API.formatData(data);
        let res = await API.createListing(formattedData);
        return res;
    });

    return await Promise.all(apiRes);
}


module.exports = {
    createListing
}