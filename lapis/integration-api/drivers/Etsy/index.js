const fetch = require('node-fetch');
const formData = require('form-data');

const genAuthHeader = require('./oauth');
const queryModel = require('../../../api/etsy-listing/models/etsy-listing.settings.json');

const ETSY_API_URL = "https://openapi.etsy.com/v2/listings?";
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
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : oAuthHeader
            }
        }
    )
    .then(res => res.json())
    .then(resJSON => {
        console.log('response: ', resJSON);
        if(typeof(data.images) !== "undefined") {

            let listingId = resJSON.results[0].listing_id;
            uploadListingImages(listingId, data.images);
        }


    })
    .catch(e => {console.log("error: ",  e)});
}

const uploadListingImages = (listingId, images) => {
    let queryURL = ETSY_API_URL+ listingId + "/images";
    
    images.forEach(image => {
        console.log("image: ", image);

        // imageForm = new formData();
        // imageForm.append("image", image);

        // const requestData = {
        //     url: queryURL,
        //     method: 'POST',
        //     data : imageForm
        // }  

        // fetch(
        //     queryURL, 
        //     {
        //         method: 'POST',
        //         credentials: 'include',
        //         headers: {
        //             'Content-Type' : 'multipart/form-dataheader',
        //             ...imageForm.getHeaders(),
        //             ...genAuthHeader(requestData)
        //         },
        //         body: imageForm
        //     },
        // )

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
        if(typeof(data[key]) !== "undefined" || data[key] !== "images") {
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