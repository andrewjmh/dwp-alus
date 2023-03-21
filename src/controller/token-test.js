const path = require('path');

const postTokenTest = async (req, res) =>{
    res.status(200).send("Token Works - Yay!");
};

module.exports = {
    postTokenTest,
}
