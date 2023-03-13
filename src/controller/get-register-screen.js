const path = require('path');

const getRegisterScreen = async (req, res) => {
    try {
        res.render( path.resolve( 'views', 'register.ejs') );
    } catch (err) {
        console.log(err);
        console.log('error rendering page')
    }
};

module.exports = {
    getRegisterScreen,
};
