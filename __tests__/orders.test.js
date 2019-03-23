const axios = require('axios').default;
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const {
    getAllOrders,
    consumeNewOrders
} = require('../api');

const ordersMock = require('orders.response.mock');
const backOrders = require('backorders.response.mock');
const treatedProductsMock = require('treatedProducts.mock');
const inventoryRequest = require('inventoriesParams.mock');

afterEach(() => {
    mock.reset();
});

describe('Orders', () => {
    describe('getAllOrders', () => {
        test('Check if getAllOrders is being called with correct request params', (done) => {
            mock
                .onGet('/orders').reply(200, ordersMock)
                .onAny().passThrough()  ;

            getAllOrders()
                .then((res) => {
                    expect(res).toEqual(ordersMock.orders);
                    done();
                })
                .catch((err) => {
                    done.fail(err);
                });

        });
    });

    describe('consumeOrders', () => {
        test('Consume orders only when STATE is NEW, if available process them', (done) => {
            mock
                .onPut('/orders/order_2/processing').reply(200)
                .onPatch('/products/options/inventory-levels').reply(config => {
                    expect(config.data).toEqual(JSON.stringify(inventoryRequest));
                    return [200, {}];
                })
                .onAny().reply(500);
            
            consumeNewOrders(ordersMock.orders, treatedProductsMock)
                .then((res) => {
                    done();
                })
                .catch(err => done.fail(err));
        });
    
        test('Consume orders only when STATE is NEW, if not available backorder them', (done) => {
            mock
                .onPost('/orders/order_item2/items/availability').reply(200)
                .onAny().reply(500)
            
            consumeNewOrders(backOrders.orders, treatedProductsMock)
                .then((res) => {
                    done();
                })
                .catch(err => done.fail(err));
        });
    });
})

