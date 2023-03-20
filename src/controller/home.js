const path = require('path');

const getHome = async (req, res) => {
    try {
        res.render( path.resolve('src', 'views', 'home.njk') );
    } catch (err) {
        console.log(err);
        console.log('its broken')
    }
};
module.exports = {
    getHome,
};
