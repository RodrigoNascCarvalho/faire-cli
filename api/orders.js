const faireApi = require('./faire-api');
const { info, debug } = require('../log');

const backorderOrderItem = (orderItem) => {
    return faireApi.post(`/orders/${orderItem.id}/items/availability`, {
        [orderItem.id]: {
            "available_quantity": orderItem.quantity,
            "backordered_until": null,
            "discontinued": true
        }
    }); 
};

const updateAvailabilities = async (items, products) => {
    const inventories = items.map(item => {
        const productOption = getProductInventory(products, item);
        const remainingQty = productOption - item.quantity > 0 ? productOption - item.quantity : 0;

        return {
            "sku": item.sku,
            "current_quantity": remainingQty > 0 ? remainingQty : 0,
            "discontinued": false,
            "backordered_until": null
        };
   })

   return await faireApi.patch('/products/options/inventory-levels', {
        inventories
   });
};

const acceptOrder = async (order, products) => {
    try {
        await faireApi.put(`/orders/${order.id}/processing`);
        return updateAvailabilities(order.items, products);
    } catch (error) {
        throw error;
    }
};

const getProductInventory = (products, orderItem) => {
    const product = products[orderItem['product_id']];
    const productOption = product && product[orderItem['product_option_id']];

    return productOption;
};

const consumeNewOrders = (orders, products) => {
    const newOrders = orders.filter(order => order.state === 'NEW');

    if (!newOrders.length) {
        info('No new orders to process.\n');
        return;
    }

    const processingOrders = newOrders.map(async (order) => {
        try {
            let processableOrders = 0, backordered = [];
            
            order.items.forEach((item) => {
                const productOption = getProductInventory(products, item);
                
                if (productOption - item.quantity >= 0) {
                    processableOrders += 1;
                } else {
                    backordered.push(item);
                }
            });

            if (processableOrders === order.items.length) {
                return acceptOrder(order, products);
            } else {
                return Promise.all(backordered.map(item => backorderOrderItem(item)))
            }
        } catch (error) {
            const reason = error.response && error.response.data;
            info(`[ERROR][ORDER ID: ${orderItem['order_id']}]:${error.message} - ${reason.message}`);
        }
    });

    return Promise.all(processingOrders);
};

const getAllOrders = async () => {
    try {
        const { data } = await faireApi.get(`/orders`);

        debug(data.orders);
        
        return data.orders;
    } catch (error) {
        const reason = error.response && error.response.data;
        info(`[ERROR][GET_ALL_ORDERS]:${error.message} - ${reason.message}`);
    }
};

module.exports = {
    getAllOrders,
    consumeNewOrders
};
