/**
 * Module to centralize implementations for all endpoints that were implemented.
 * @module api
 */

const products = require('./products');
const orders = require('./orders');

module.exports = {
    ...products,
    ...orders
};
