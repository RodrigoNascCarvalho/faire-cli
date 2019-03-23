const api = require('./api');
const util = require('./util');

/**
 * Adding option to change brand on the fly when executing command.
 */
const BRAND = process.argv[3] || 'b_d2481b88';

/**
 * 1. Get all products for a given brand
 * 2. Get all orders
 * 3. Consume NEW orders, either by adding to backordered status or processing
 * 4. Print statistics
 */
(async function() {
    const brandProducts = await api.getProductsFromBrands(BRAND);
    const allOrders = await api.getAllOrders();

    await api.consumeNewOrders(allOrders, brandProducts);
    util.printOrderStatistics(allOrders);
}());
