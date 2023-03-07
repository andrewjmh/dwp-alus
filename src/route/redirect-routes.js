const express = require('express');

const redirectToHome = async (req, res) => {
    res.render('../views/home.ejs');
};
const render404Page = async (req, res) => {
    res.render('../views/404_error_page.ejs', {});
};
const routeRedirect = () => {
    const app = express.Router();
    app.get('/', redirectToHome);
    app.get('/*', render404Page);
    return app;
};

module.exports = {
    redirectToHome,
    render404Page,
    routeRedirect,
};
