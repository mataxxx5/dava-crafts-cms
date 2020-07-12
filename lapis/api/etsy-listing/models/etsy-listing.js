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
            console.log("statusList: ", results[0]);
            console.log("image object: ", results[0].imageRes[0]);
            // delete the record or give notification if any other status code than two hundred returns
        } 
    }
};
