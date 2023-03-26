const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {json} = require("express");
const path = require("path");
const sqlite3 = require('sqlite3').verbose()
const databaseSource = "alus.db"
require("dotenv").config();

const createDatabase = () => {
    const alusDatabase = new sqlite3.Database(databaseSource, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message)
            throw err
        }
        else {

            const salt = bcrypt.genSaltSync(10);

            console.log('creating user table');
            alusDatabase.run(`CREATE TABLE Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Username text,
            Email text,
            Password text,
            Salt text,
            Token text,
            DateLoggedIn DATE,
            DateCreated DATE
            )`,
                (err) => {
                    if (err) {
                        console.log('user table already exists')
                        // Table already created
                    } else {
                        console.log('adding rows');
                        // Table just created, creating some rows
                        const insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                        alusDatabase.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
                        alusDatabase.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
                        alusDatabase.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
                        alusDatabase.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
                        alusDatabase.run(insert, ["user5", "user5@example.com", bcrypt.hashSync("user5", salt), salt, Date('now')])
                    }
                });
            console.log('creating acronym table');
            alusDatabase.run(`CREATE TABLE Acronyms (
            acronym_id INTEGER PRIMARY KEY AUTOINCREMENT,
            acronym text,
            definition text,
            description text
            )`,
                (err) => {
                    if (err) {
                        console.log('acronym table already exists')
                        // Table already created
                    } else{
                        console.log('adding rows');
                        // Table just created, creating some rows
                        const insert = 'INSERT INTO Acronyms (acronym, definition, description) VALUES (?,?,?)'
                        alusDatabase.run(insert, ["DWP", "Department for Work and Pensions", "Responsible for welfare, pensions and child maintenance policy. As the UK’s biggest public service department it administers the State Pension and a range of working age, disability and ill health benefits to around 20 million claimants and customers."])
                        alusDatabase.run(insert, ["ABC", "Alphabet", "all the letters"])
                        alusDatabase.run(insert, ["ABC1", "Alphabet1", "all the letters1"])
                        alusDatabase.run(insert, ["ABC2", "Alphabet2", "all the letters2"])
                        alusDatabase.run(insert, ["ABC3", "Alphabet3", "all the letters3"])
                    }
                });
            alusDatabase.close();
        }
    });
}

const getAcronyms = (req, res) => {
    // Creating a new database connection
    const alusDatabase = new sqlite3.Database(databaseSource);
    // Querying the Acronyms table
    alusDatabase.all('SELECT * FROM Acronyms ORDER BY acronym ASC', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving acronyms from database');
            return;
        }
        alusDatabase.close()
        // Render the template using Nunjucks
        return res.render('home', { acronyms: rows });
    });
};

// A function that handles a post request to register a new user
const postRegisterRequest = async (req, res) => {
    try {
        // Extracting the username, email and password from the request body
        const { Username, Email, Password } = req.body;

        // If any of the required fields is missing, return an error response
        if (!Username || !Email || !Password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        // Creating a new database connection
        const alusDatabase = new sqlite3.Database(databaseSource);

        // Selecting a user with the provided email
        const sql = "SELECT * FROM Users WHERE Email = ?";
        const existingUser = await new Promise((resolve, reject) => {
            alusDatabase.get(sql, [Email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        // If a user with the provided email already exists, close the database connection and return an error response
        if (existingUser) {
            alusDatabase.close();
            return res.status(400).json({ error: "A user with this email already exists. Please login." });
        }

        // Generating a salt for the password
        const salt = bcrypt.genSaltSync(10);
        // Hashing the password with the generated salt
        const hashedPassword = bcrypt.hashSync(Password, salt);
        // Getting the current date and time
        const dateCreated = Date.now();

        // Inserting the new user into the database
        const insertSql = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)';
        const insertParams = [Username, Email, hashedPassword, salt, dateCreated];

        alusDatabase.run(insertSql, insertParams, function (err) {
            alusDatabase.close();

            // If there's an error inserting the new user, return an error response
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            // If the user was inserted successfully, return a success response
            return res.render('register_success.njk');
        });
    } catch (error) {
        // If there's an error during the execution of the function, log the error and return a server error response
        console.error(error);
        return res.status(500).json({ error: "Server error." });
    }
};

const postLoginRequest = async (req, res) => {
    const alusDatabase = new sqlite3.Database(databaseSource, async (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message)
            throw err
        } else {
            console.log('connection success!')
        }
        try {
            const {Email, Password} = req.body;
            // Make sure there is an Email and Password in the request
            if (!(Email && Password)) {
                res.status(400).send("All input is required");
            }

            let user = [];

            const sql = "SELECT * FROM Users WHERE Email = ?";

            alusDatabase.all(sql, Email, async function (err, rows) {
                if (err) {
                    res.status(400).json({"error": err.message})
                    return;
                }

                rows.forEach(function (row) {
                    user.push(row);
                })

                if (typeof user === "undefined" || typeof user[0] === "undefined") {
                    const err = "Password is required";
                    return res.render("login.njk", { err });
                }

                // Compare password with hash using bcrypt
                const passwordMatch = await bcrypt.compare(Password, user[0].Password);

                // If password doesn't match, render login page with error message
                if (!passwordMatch) {
                    const err = "Invalid password";
                    return res.render("login.njk", { err });
                }

                // If password matches, create a JWT token and send it as a response
                const payload = { user_id: user[0].Id, username: user[0].Username, Email };
                const options = { expiresIn: "1h" }; // Token expires in 1 hour
                user[0].Token = jwt.sign(payload, process.env.TOKEN_KEY, options);
                console.log('user below');
                console.log(user);
                const username = user[0].Username;
                return res.render('home.njk', {username});
                });
        } catch (err) {
            console.log(err);
        }
    });
    alusDatabase.close();
}


module.exports = {
    createDatabase,
    getAcronyms,
    postRegisterRequest,
    postLoginRequest,
};
