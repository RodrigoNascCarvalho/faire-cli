const faireApi = require('./faire-api');
const { info, debug } = require('../log');

const formatOptions = (options) => (
    options
        .reduce((newObj, option) => ({
            ...newObj,
            [option.id]: option.available_quantity ? option.available_quantity : 0
        }), {})
)

const treatProductDataByBrand = (products, brand) => (
    products
        .filter((product) => product.brand_id === brand)
        .reduce((simplified, product) => {
            const options = formatOptions(product.options);

            simplified[product.id] = options;

            return simplified;
        }, {}
    )
);

const getProductsFromBrands = async (brand) => {
    try {
        const { data } = await faireApi.get('/products');
        
        debug(data.products);
        
        const brandProducts = treatProductDataByBrand(data.products, brand);

        return brandProducts;
    } catch (error) {
        info(error)
        const reason = error.response && error.response.data;
        info(`[ERROR][GET_ALL_PRODUCTS]:${error.message} - ${reason.message}`);
    }
};

module.exports = {
    getProductsFromBrands
};
