const path = require('path');

const getAddSuggestionScreen = async (req, res) => {
    try {
        res.render( path.resolve('src', 'views', 'add-suggestion.njk') );
    } catch (err) {
        console.log(err);
        console.log('error rendering page')
    }
};

module.exports = {
    getAddSuggestionScreen,
};
