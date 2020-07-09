const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

const creds = require('../../../credentials/etsy/creds.json'); 

// currently static
const tokenData = {
    key: creds.temp_oauth_token_key,
    secret: creds.temp_oauth_token_secret
}

const oauth = OAuth(
    {
        // app credentials
        consumer: {
            key: appEtsyCreds.key,
            secret: appEtsyCreds.secret
        },
        signature_method: 'HMAC-SHA1',
        hash_function(baseString, key) {
            return crypto.createHmac('sha1', key).update(baseString).digest('base64');
        }
    }
)

const genAuthHeader = (requestData) => {
    let oauthHeader = oauth.toHeader(oauth.authorize(requestData, tokenData)).Authorization;
    return oauthHeader;
}


export default genAuthHeader;