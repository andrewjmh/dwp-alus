const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config();
const port = 3004;
var md5 = require('md5')
var sqlite3 = require('sqlite3').verbose()
const cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const DBSOURCE = "usersdb.sqlite";
const auth = require("./middleware");
const manageRoutes = require('./route/manage-routes').getRoutes();
const redirectRoutes = require('./route/redirect-routes').routeRedirect();
const {createDatabase, insertOne} = require('./sqlite/database');

createDatabase();

app.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:3000'
    })
);

app.set('view engine', 'ejs');

app.get('/home', function(req, res){

    // Rendering home.ejs page
    res.render(path.join(__dirname, 'views/home.ejs'));
})

app.use('/', manageRoutes);
app.use('/', redirectRoutes);

app.post("/api/test", auth, (req, res) => {
    res.status(200).send("Token Works - Yay!");
});


app.listen(port, () => console.log(`API listening on port ${port}!`));
