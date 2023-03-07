const express = require('express');
const { getHome } = require('../controller/home.js');

const getRoutes = () => {
    const app = express.Router();
    app.get('/home', getHome);
    return app;
};

module.exports = {
    getRoutes,
};
