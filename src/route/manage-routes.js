const express = require('express');
const {getHome} = require('../controller/home.js');
const {getRegisterScreen} = require("../controller/get-register-screen");
const {postRegisterRequest, postLoginRequest} = require('../sqlite/database');

const getRoutes = () => {
    const app = express.Router();
    app.get('/home', getHome);
    app.get('/register', getRegisterScreen);
    app.post('/api/register', postRegisterRequest);
    app.post('/api/login', postLoginRequest)
    return app;
};

module.exports = {
    getRoutes,
};
