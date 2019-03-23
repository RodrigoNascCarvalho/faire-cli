const { info } = require('../log');

/**
 * Flatten all items inside order into one array
 * @function flattenItems
 * @param {Array} orders
 * @returns {Array} flattenedArray
 */
const flattenItems = (orders) => (
    orders.reduce((flattened, order) => flattened.concat(order.items), [])
);

/**
 * Function to find biggest value for an object with an specific key-value format
 * @function findBiggest
 * @param {Object} tupleObj { key1: val1, key2: val2, key3: val3, ... }
 * @returns {Object} biggest value found for key
 */
const findBiggest = (tupleObj) => (
    Object.keys(tupleObj).reduce((biggest, key) => {
        if (tupleObj[key] > biggest.value) {
            biggest = {
                key,
                value: tupleObj[key]
            }
        }
        return biggest;
    }, { key: null, value: Number.MIN_VALUE })
);

/**
 * Reducer helper to manipulate objects into a format { key1: val1, key2: val2, ...}
 * @function reduceAndFindBiggest
 * @param {Array} orders
 * @param {Function} reducer
 * @returns biggest value
 */
const reduceAndFindBiggest = (orders, reducer) => {
    const reducedForm = orders
        .reduce(reducer, {});

    return findBiggest(reducedForm);
};

/**
 * Utilitary function to print statistics.
 * @function printOrderStatistics
 * @param {Array} orders
 */
const printOrderStatistics = (orders) => {
    if (!orders.length) {
        info('No orders to be processed for statistics at the moment.');
        return;
    };

    info('=== STATISTICS ===');

    const mostSoldProduct = reduceAndFindBiggest(flattenItems(orders), (productOptions, item) => {
        const currAmount = productOptions[item.product_option_name] ? productOptions[item.product_option_name] : 0;
        productOptions[item.product_option_name] = currAmount + item.quantity;
        return productOptions;
    });
    info(`Most sold product option is ${mostSoldProduct.key} with ${mostSoldProduct.value} quantity.`);

    const largestByDollarAmount = reduceAndFindBiggest(orders, (ordersByAmount, order) => {
        ordersByAmount[order.id] = order.items.reduce((sum, item) => sum + item.price_cents, 0);
        return ordersByAmount;
    });
    info(`Largest order by dollar is ${largestByDollarAmount.key} with ${largestByDollarAmount.value} US cents`);

    const stateWithMostOrders = reduceAndFindBiggest(orders, (states, order) => {
        const currAmount = states[order.address.state] ? states[order.address.state] : 0;
        states[order.address.state] = currAmount + 1;
        return states;
    });
    info(`State with most orders is ${stateWithMostOrders.key} with ${stateWithMostOrders.value} orders`);

    const stateWithMostItems = reduceAndFindBiggest(orders, (states, order) => {
        const currAmount = states[order.address.state] ? states[order.address.state] : 0;
        states[order.address.state] = currAmount + order.items.length;
        return states;
    });
    info(`State with most ordered items is ${stateWithMostItems.key} with ${stateWithMostItems.value} ordered items`);

    const cityWithMostShipments = reduceAndFindBiggest(orders, (cities, order) => {
        const currAmount = cities[order.address.city] ? cities[order.address.city] : 0;
        cities[order.address.city] = currAmount + order.shipments.length;
        return cities;
    });
    info(`City with most shipments is ${cityWithMostShipments.key} with ${cityWithMostShipments.value} shipments`);
};

module.exports = {
    printOrderStatistics,
    flattenItems
};
