const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
require("dotenv").config();
const port = 3004;
const cors = require('cors');
const manageRoutes = require('./route/manage-routes').getRoutes();
const redirectRoutes = require('./route/redirect-routes').routeRedirect();
const {createDatabase, getAcronyms} = require('./sqlite/database');
const { nunjucksConfig } = require('./nunjucks-config');

nunjucksConfig(app);

createDatabase();

app.use(session({
    secret: 'mysecretkey', // Change this to a random, secure value
    resave: false,
    saveUninitialized: true
}));

app.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:3000'
    })
);

app.use('/assets', express.static(path.resolve(__dirname, '../assets'), ));

app.use('/', manageRoutes);
app.use('/', redirectRoutes);

app.listen(port, () => console.log(`API listening on port ${port}!`));
