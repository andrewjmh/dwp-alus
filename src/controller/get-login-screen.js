const path = require('path');

const getLoginScreen = async (req, res) => {
    try {
        res.render( path.resolve('src', 'views', 'login.njk') );
    } catch (err) {
        console.log(err);
        console.log('error rendering page')
    }
};

module.exports = {
    getLoginScreen,
};
