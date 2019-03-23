/**
 * Module used to create pre-configured instance for faire-api.
 * @module faire-api
 */

const axios = require('axios').default;
const { info } = require('../log');

const API_URL = 'https://www.faire-stage.com/api/v1';

const TOKEN = process.argv[2] || (process.env.TEST_TOKEN);
if (!TOKEN) {
    const howToUse = `
        How to use:
        npm run faire-cli TOKEN [BRAND]

        Where:
        - TOKEN is the Faire API token [MANDATORY]
        - BRAND is the brand token [OPTIONAL]
    `;
    info(howToUse);
    process.exit(-1);
}

module.exports = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-FAIRE-ACCESS-TOKEN': TOKEN
    }
});
