const express = require('express');
const {getHome} = require('../controller/home.js');
const {getRegisterScreen} = require("../controller/get-register-screen");
const {getLoginScreen} = require("../controller/get-login-screen");
const {postRegisterRequest, postLoginRequest} = require('../sqlite/database');
const {postTokenTest} = require('../controller/token-test');
const auth = require("../middleware");

const getRoutes = () => {
    const app = express.Router();
    app.get('/home', getHome);
    app.get('/register', getRegisterScreen);
    app.get('/login', getLoginScreen);
    app.post('/api/register', postRegisterRequest);
    app.post('/api/login', postLoginRequest);
    app.post('/api/test', postTokenTest);
    return app;
};

module.exports = {
    getRoutes,
};
