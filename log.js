module.exports = {
    info: console.log,
    debug: process.env.DEBUG ? console.log : () => {}
};
