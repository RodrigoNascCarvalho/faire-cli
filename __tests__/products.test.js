const axios = require('axios').default;
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const {
  getProductsFromBrands
} = require('../api');

const productResponseMock = require('products.response.mock');
const treatedProductsMock = require('treatedProducts.mock');

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mock.reset();
});


test('getProductsFromBrands: Treat data correctly so we can use it properly later', (done) => {
  mock
    .onGet('/products').reply(200, productResponseMock)
    .onAny().reply(400);;

  getProductsFromBrands('my_brand')
    .then((res) => {
      expect(res).toEqual(treatedProductsMock);
      done();
    })
    .catch((err) => done.fail(err));

});
