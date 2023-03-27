const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {json} = require("express");
const session = require('express-session');
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
                            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT NOT NULL,
                            email TEXT NOT NULL,
                            password TEXT NOT NULL,
                            salt TEXT,
                            token TEXT,
                            is_admin BOOLEAN NOT NULL DEFAULT 0,
                            date_created DATE )`,

                (err) => {
                    if (err) {
                        console.log('user table already exists')
                        // Table already created
                    } else {
                        console.log('adding rows');
                        // Table just created, creating some rows
                        const insert = 'INSERT INTO Users (username, email, password, salt, date_created, is_admin) VALUES (?,?,?,?,?,?)'
                        alusDatabase.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now'), 0])
                        alusDatabase.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now'), 0])
                        alusDatabase.run(insert, ["admin", "admin@example.com", bcrypt.hashSync("admin", salt), salt, Date('now'), 1])
                    }
                });
            console.log('creating suggestions table');
            alusDatabase.run(`CREATE TABLE Suggestions (
                            suggestion_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            acronym TEXT NOT NULL, definition TEXT NOT NULL,
                            description TEXT NOT NULL, user_id INTEGER NOT NULL,
                            is_approved INTEGER DEFAULT 0,
                            FOREIGN KEY (user_id) REFERENCES Users (user_id) )`,

                (err) => {
                    if (err) {
                        // Table already created
                        console.log('user table already exists')
                    }
                });
            console.log('creating acronym table');
            alusDatabase.run(`CREATE TABLE Acronyms (
                            acronym_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            acronym TEXT NOT NULL,
                            definition TEXT NOT NULL,
                            description TEXT NOT NULL )`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log('acronym table already exists')
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
            console.log('creating approval table');
            alusDatabase.run(`CREATE TABLE Approval (
                            approval_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            suggestion_id INTEGER NOT NULL, 
                            admin_id INTEGER NOT NULL, 
                            approved_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
                            FOREIGN KEY (suggestion_id) REFERENCES Suggestions (suggestion_id), 
                            FOREIGN KEY (admin_id) REFERENCES Users (user_id) )`,

                (err) => {
                    if (err) {
                        // Table already created
                        console.log('approvals table already exists')
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
        //return res.render('home', { acronyms: rows });
        //req.session.acronyms = { acronyms: rows };

        if (req.session) {
            res.render('home', { username: req.session.username, is_admin: req.session.isAdmin,  acronyms: rows });
        } else {
            res.render('home', { acronyms: rows });
        }
    });
};

// A function that handles a post request to register a new user
const postRegisterRequest = async (req, res) => {
    try {
        // Extracting the username, email and password from the request body
        const { username, email, password } = req.body;

        // If any of the required fields is missing, return an error response
        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email, and password are required" });
        }

        // Creating a new database connection
        const alusDatabase = new sqlite3.Database(databaseSource);

        // Selecting a user with the provided email
        const sql = "SELECT * FROM Users WHERE email = ?";
        const existingUser = await new Promise((resolve, reject) => {
            alusDatabase.get(sql, [email], (err, row) => {
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
        const hashedpassword = bcrypt.hashSync(password, salt);
        // Getting the current date and time
        const dateCreated = Date.now();

        // Inserting the new user into the database
        const insertSql = 'INSERT INTO Users (username, email, password, salt, DateCreated) VALUES (?,?,?,?,?)';
        const insertParams = [username, email, hashedpassword, salt, dateCreated];

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
            const {email, password} = req.body;
            // Make sure there is an email and password in the request
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }

            let user = [];

            const sql = "SELECT * FROM Users WHERE email = ?";

            alusDatabase.all(sql, email, async function (err, rows) {
                if (err) {
                    res.status(400).json({"error": err.message})
                    return;
                }

                rows.forEach(function (row) {
                    user.push(row);
                })

                if (typeof user === "undefined" || typeof user[0] === "undefined") {
                    const err = "password is required";
                    return res.render("login.njk", { err });
                }

                // Compare password with hash using bcrypt
                const passwordMatch = await bcrypt.compare(password, user[0].password);

                // If password doesn't match, render login page with error message
                if (!passwordMatch) {
                    const err = "Invalid password";
                    return res.render("login.njk", { err });
                }

                // If password matches, create a JWT token and send it as a response
                const payload = { user_id: user[0].user_id, username: user[0].username, email, is_admin: user[0].is_admin };
                const options = { expiresIn: "1h" }; // Token expires in 1 hour
                user[0].Token = jwt.sign(payload, process.env.TOKEN_KEY, options);
                console.log('user below');
                console.log(user);
                req.session.userId = user[0].user_id;
                req.session.username = user[0].username;
                req.session.isAdmin = user[0].is_admin;
                const username = user[0].username;
                //res.render('home', {username, is_admin: req.session.isAdmin, acronyms: req.session.acronyms});
                getAcronyms(req, res);
                });
        } catch (err) {
            console.log(err);
        }
    });
    alusDatabase.close();
}

const postSuggestion = async (req, res) => {
    const user_id = req.session.userId;
    const { acronym, definition, description } = req.body;

    if (!acronym || !definition || !description) {
        res.status(400).send('Missing required fields');
        return;
    }

    if (!user_id) {
        res.status(400).send('Missing user id, please log in');
        return;
    }

    const alusDatabase = new sqlite3.Database(databaseSource);

    alusDatabase.run(
        'INSERT INTO suggestions (acronym, definition, description, user_id) VALUES (?, ?, ?, ?)',
        [acronym, definition, description, user_id],
        (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error adding suggestion to database');
                return;
            }

            return res.render('suggestion_success.njk');
        }
    );

    alusDatabase.close();
};


module.exports = {
    createDatabase,
    getAcronyms,
    postRegisterRequest,
    postLoginRequest,
    postSuggestion,
};
