const {getAcronyms} = require("../sqlite/database");
const session = require("express-session");
const app = require("express/lib/router");

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Session destroyed');
            getAcronyms(req, res);
        }
    });
};

module.exports = {
    logout,
};
