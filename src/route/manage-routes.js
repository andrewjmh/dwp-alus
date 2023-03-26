const express = require('express');
const {getHome} = require('../controller/home.js');
const {getRegisterScreen} = require("../controller/get-register-screen");
const {getLoginScreen} = require("../controller/get-login-screen");
const {getAddSuggestionScreen} = require("../controller/get-add-suggestion-screen");
const {postRegisterRequest, postLoginRequest, getAcronyms} = require('../sqlite/database');
const {postTokenTest} = require('../controller/token-test');
const auth = require("../middleware");

const getRoutes = () => {
    const app = express.Router();
    app.get('/acronyms', getAcronyms);
    app.get('/home', getAcronyms);
    app.get('/add-suggestion', getAddSuggestionScreen);
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
