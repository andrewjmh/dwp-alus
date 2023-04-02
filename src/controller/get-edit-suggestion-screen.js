const path = require('path');
const session = require('express-session');

const getEditSuggestionScreen = async (req, res) => {
    try {
        const suggestion_id = req.body.suggestion_id;
        res.render('edit-suggestion', { suggestion_id });
    } catch (err) {
        console.log(err);
        console.log('error rendering page')
    }
};

module.exports = {
    getEditSuggestionScreen,
};
