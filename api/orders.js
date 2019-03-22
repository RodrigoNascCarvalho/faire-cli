const faireApi = require('./faire-api');
const { flattenItems } = require('../util');

const backorderOrder = (orderItem) => {
    return faireApi.post(`/orders/${orderItem['order_id']}/items/availability`, {
        [orderItem.id]: {
            "available_quantity": orderItem.quantity,
            "backordered_until": null,
            "discontinued": false
        }
    });
};

const acceptOrder = async (order, option, optionId) => {
    try {
        await faireApi.put(`/orders/${order.id}/processing`);
    } catch (error) {
        throw error;
    } finally {
        const remainingQty = option.available_quantity - order.quantity > 0 ? option.available_quantity - order.quantity : 0;

        return faireApi.patch(`/products/options/${optionId}`, {
            "available_units": remainingQty,
        });
    }
};

const getProductInventory = (products, orderItem) => {
    const product = products[orderItem['product_id']];
    const productOption = product && product[orderItem['product_option_id']];

    return productOption;
};

const consumeOrders = (orders, products) => {
    const orderedItems = flattenItems(orders);

    if (!orderedItems.length) {
        console.log('No new orders to process.\n');
        return;
    }

    orderedItems.forEach(async (orderItem) => {
        const productOption = getProductInventory(products, orderItem);

        try {
            if (productOption.available_quantity >= orderItem.quantity) {
                await acceptOrder(products, productOption, orderItem['product_option_id']);
            } else {
                await backorderOrder(orderItem);
            }
        } catch (error) {
            const reason = error.response && error.response.data;
            console.log(`[ERROR][ORDER ID: ${orderItem['order_id']}]:${error.message} - ${reason.message}`);
        }
    });
};

const getAllOrders = async () => {
    try {
        const { data } = await faireApi.get(`/orders`);

        return data.orders;
    } catch (error) {
        const reason = error.response && error.response.data;
        console.log(`[ERROR][GET_ALL_ORDERS]:${error.message} - ${reason.message}`);
    }
};

module.exports = {
    getAllOrders,
    consumeOrders
};
