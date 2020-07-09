'use strict';
const ActionsAPI = require('../../../integration-api');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async afterCreate(result, data) {
            ActionsAPI.createListing(data)
        } 
    }
};
