const fetch = require('node-fetch');
const formData = require('form-data');
const fs = require('fs');

const genAuthHeader = require('./oauth');
const queryModel = require('../../../api/etsy-listing/models/etsy-listing.settings.json');

const ETSY_API_URL = "https://openapi.etsy.com/v2/listings";
const FILE_DIR = "./public/";
const TESTING_STATE = "draft";
const STATIC_SHIPPING_ID = "100254567443";

const createListing = async (data) => {
    console.log("data: ", data);
    const queryURL = buildQueryStr(data);

    const requestData = {
        url: queryURL,
        method: 'POST',
        data : {}
    }  

    let oAuthHeader = genAuthHeader(requestData);

    try {
        console.log("createListing try block...");
        let res = await fetch(
            queryURL, 
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded', 
                    'Authorization' : oAuthHeader
                }
            }
        );
        let resJSON = await res.json();
        let status =  await (async () => {
            if(typeof(data.Images) !== "undefined") {
                let statusa = {};
                statusa["entry"] = resJSON;
                let listingId = resJSON.results[0].listing_id;
                statusa["imageRes"] = await uploadListingImages(listingId, data.Images);
                return  statusa;
            } else {
                return resJSON;
            }
        })();

        return status;

    } catch (e) {

        console.log("error: ", e);
        return e;

    } 
    
    // .then(res => res.json())
    // .then(async resJSON => {
    //     let status = {};
    //     console.log('response: ', resJSON);
    //     status["entry"] = resJSON;

    //     if(typeof(data.Images) !== "undefined") {

    //         let listingId = resJSON.results[0].listing_id;
    //         status["imageRes"] = await uploadListingImages(listingId, data.Images);
    //         return  status;
    //     } else {
    //         return status;
    //     }

    // })
    // .catch(e => {
    //     let status = {};
    //     console.log("error: ",  e);
    //     status["error"] = e;

    //     return status
    // });
}

const uploadListingImages = async (listingId, images) => {
    let queryURL = `${ETSY_API_URL}/${listingId}/images`;

    try {
        let promises = await images.map(async image => {
            imageForm = new formData();
            imageForm.append("image", fs.createReadStream(FILE_DIR + image.url));
    
            const requestData = {
                url: queryURL,
                method: 'POST',
                data : {}
            }
    
            let res = await fetch(
                queryURL, 
                {
                    method: 'POST',
                    body: imageForm,
                    headers: {
                        "Authorization": genAuthHeader(requestData),
                        ...imageForm.getHeaders()
                    }
                },
            );
            let resJSOn = await res.json();
            return resJSOn;
        });

        return await Promise.all(promises);

    } catch(e) {
        return e
    }
}

const updateListing = () => {
    // stub 
}

const deleteListing = (data) => {

    let list
    let queryURL =`${ETSY_API_URL}/${listingId}`;

}


const buildQueryStr = (data) => {
    // currently static values draft state for testing and only available shipping template
    let queryStr = `${ETSY_API_URL}?state=${TESTING_STATE}&shipping_template_id=${STATIC_SHIPPING_ID}`;

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