const express = require('express');
const {getHome} = require('../controller/home.js');
const {getRegisterScreen} = require("../controller/get-register-screen");
const {getLoginScreen} = require("../controller/get-login-screen");
const {getAddSuggestionScreen} = require("../controller/get-add-suggestion-screen");
const {getEditSuggestionScreen} = require("../controller/get-edit-suggestion-screen");
const {postRegisterRequest, postLoginRequest, postSuggestion, getAcronyms, getSuggestions, deleteSuggestion, addSuggestion,
    editSuggestion
} = require('../sqlite/database');
const {postTokenTest} = require('../controller/token-test');
const {logout} = require("../controller/logout");
const auth = require("../middleware");

const getRoutes = () => {
    const app = express.Router();
    app.get('/acronyms', getAcronyms);
    app.get('/home', getAcronyms);
    app.get('/add-suggestion', getAddSuggestionScreen);
    app.get('/register', getRegisterScreen);
    app.get('/login', getLoginScreen);
    app.post('/edit-suggestion', getEditSuggestionScreen);
    app.get('/api/suggestions', getSuggestions);
    app.post('/api/register', postRegisterRequest);
    app.post('/api/login', postLoginRequest);
    app.post('/api/suggestion', postSuggestion);
    app.post('/add-suggestion', addSuggestion);
    app.post('/submit-edit', editSuggestion);
    app.post('/delete-suggestion', deleteSuggestion);
    app.post('/logout', logout);
    app.post('/api/test', postTokenTest);
    return app;
};

module.exports = {
    getRoutes,
};
