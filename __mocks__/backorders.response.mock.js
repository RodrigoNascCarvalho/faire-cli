module.exports = {
    orders: [{
            "id": "order_1",
            "state": "PROCESSING",
        },
        {
            "id": "order_2",
            "state": "NEW",
            "items": [{
                "id": "order_item2",
                "sku": "test_1",
                "order_id": "order_2",
                "product_id": "p_123",
                "product_option_id": "po_123",
                "quantity": 50,
            }, {
                "id": "order_item1",
                "order_id": "order_2",
                "sku": "test_2",
                "product_id": "f_123",
                "product_option_id": "fo_123",
                "quantity": 10,
            }]
        },
        {
            "id": "order_3",
            "state": "DELIVERED",
        }
    ]
};