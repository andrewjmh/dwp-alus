const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config();
const port = 3004;
const cors = require('cors');
const auth = require("./middleware");
const manageRoutes = require('./route/manage-routes').getRoutes();
const redirectRoutes = require('./route/redirect-routes').routeRedirect();
const {createDatabase} = require('./sqlite/database');
const { nunjucksConfig } = require('./nunjucks-config');

nunjucksConfig(app);

createDatabase();

app.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:3000'
    })
);

app.use('/assets', express.static(path.resolve(__dirname, '../assets'), ));

app.get('/home', function(req, res){

    // Rendering home.njk page
    res.render(path.join(__dirname, './views/home.njk'));
})

app.use('/', manageRoutes);
app.use('/', redirectRoutes);

app.post("/api/test", auth, (req, res) => {
    res.status(200).send("Token Works - Yay!");
});


app.listen(port, () => console.log(`API listening on port ${port}!`));
