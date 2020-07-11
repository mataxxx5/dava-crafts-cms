const fetch = require('node-fetch');
const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');

const genAuthHeader = require('./oauth');
const queryModel = require('../../../api/etsy-listing/models/etsy-listing.settings.json');
const { FILE } = require('dns');

const ETSY_API_URL = "https://openapi.etsy.com/v2/listings?";
const FILE_DIR = "./public/"
const TESTING_STATE = "draft"

const createListing = async (data) => {
    console.log("data: ", data);
    const queryURL = buildQueryStr(data);

    const requestData = {
        url: queryURL,
        method: 'POST',
        data : {}
    }  

    let oAuthHeader = genAuthHeader(requestData);

    fetch(
        queryURL, 
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : oAuthHeader
            }
        }
    )
    .then(res => res.json())
    .then(resJSON => {
        console.log('response: ', resJSON);
        if(typeof(data.Images) !== "undefined") {

            let listingId = resJSON.results[0].listing_id;
            uploadListingImages(listingId, data.Images);
        }


    })
    .catch(e => {console.log("error: ",  e)});
}

const uploadListingImages = (listingId, images) => {
    let queryURL = "https://openapi.etsy.com/v2/listings/"+ listingId + "/images";
 
    images.forEach(image => {
        imageForm = new formData();
        imageForm.append("image", fs.createReadStream(FILE_DIR + image.url));

        const requestData = {
            url: queryURL,
            method: 'POST',
            data : {}
        }

        fetch(
            queryURL, 
            {
                method: 'POST',
                body: imageForm,
                headers: {
                    "Authorization": genAuthHeader(requestData),
                    ...imageForm.getHeaders()
                }
            },
        )
        .then(response => {
            return response.json();
        })
        .then(result => {console.log(result);})
        .catch(e => {console.log("error: ",  e);});
    });
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
        if(typeof(data[key]) !== "undefined" && key !== "Images") {
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