const fetch = require('node-fetch');
const genAuthHeader = require('./oauth');
const queryModel = require('../../../api/listing/models/listing.settings.json');

const ETSY_API_URL = "https://openapi.etsy.com/v2/listings?";
const TESTING_STATE = "draft"

const createListing = async (data) => {

    let queryURL = buildQueryStr(data);

    let requestData = {
        url: queryURL,
        method: 'POST',
        data : {}
    }  

    let oAuthHeader = genAuthHeader(requestData);

    fetch(
        queryURL, 
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : oAuthHeader
            }
        }
    )
    .then(res => {
        // console.log('response: ', res);
    })
    .catch(e => {console.log("error: ",  e)});
}

const updateListing = () => {
    // stub 
}

const deleteListing = () => {
    // stub 
}


const buildQueryStr = (data) => {
    // currently static values draft state for testing and only available shipping template
    let queryStr = ETSY_API_URL + "state="+ TESTING_STATE + "&shipping_template_id=100254567443";

    Object.keys(queryModel.attributes).forEach(key => {
        if(typeof(data[key]) !== "undefined") {
            queryStr += "&" + key.toLowerCase() + "=" + data[key];
        }
    });

    return queryStr;
}

formatData = (data) => {
    // once ULF is made this method will filter and format the form
    // data to necessary etsy api
    return data;
}

module.exports = {
    createListing,
    updateListing,
    deleteListing,
    formatData
}