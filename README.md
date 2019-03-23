# Faire CLI

Tool makes the following:
1. Get all products for a given brand
2. Get all orders
3. Consume NEW orders, either by adding to backordered status or processing it whole
4. Print various statistics about the orders

To run this Node.js script, use the following commands:

```
- npm install
- npm run faire-cli <<TOKEN>> [[BRAND]]
```

Where TOKEN is mandatory for the program to properly function. If mandatory values aren't provided, the tool prints: 
```
How to use:
        npm run faire-cli TOKEN [BRAND]

        Where:
        - TOKEN is the Faire API token [MANDATORY]
        - BRAND is the brand token [OPTIONAL]
```

It's also possible to run it in debug mode, it will print both products and orders if this is executed:
```
- npm run faire-cli-debug <<TOKEN>> [[BRAND]]
```

Since it's not always that there are orders available to process, the following mocked unit tests were developed:
* /__tests__/products.test.js
* /__tests__/orders.test.js

They mainly cover success cases.

It's possible to run these tests by running:
```
- npm run test
```



