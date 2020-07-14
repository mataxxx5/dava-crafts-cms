'use strict';
const integrationAPI = require('../../../integration-api');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            // console.log("before create: ", data);
        },
        async afterCreate(result, data) {
            let results = await integrationAPI.createListing(result);
            console.log("statusList: ", results[0].entry.results);
            console.log("image object: ", results[0].imageRes[0]);
            strapi.services['etsy-listing-images'].create(
                {      
                    media_references: {
                        listingId: results[0].entry.results[0].listing_id, 
                        listingImageData: results[0].imageRes.map(datum => ({
                            listing_image_id: datum.results[0].listing_image_id,
                            image_hash: datum.params.image.name
                        }))
                    }
                }
            );


            // delete the record or give notification if any other status code than two hundred returns
        } 
    }
};
