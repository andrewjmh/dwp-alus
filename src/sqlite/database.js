const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {json} = require("express");
const session = require('express-session');
const path = require("path");
const sqlite3 = require('sqlite3').verbose()
const databaseSource = "alus.db"
require("dotenv").config();

// A function that creates a database if one doesn't exist
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
                        alusDatabase.run(insert, ["BACS", "Bankers' Automated Clearing System", "Responsible for the schemes behind the clearing and settlement of UK automated payment methods, Direct Debit and Bacs Direct Credit."])
                        alusDatabase.run(insert, ["DLA", "Disabled Living Allowance", "A monthly payment to help with care and mobility needs if you are living with a disability."])
                        alusDatabase.run(insert, ["JSA", "Job Seekers' Allowance", "An unemployment benefit paid by the Government of the United Kingdom to people who are unemployed and actively seeking work."])
                        alusDatabase.run(insert, ["NINO", "National Insurance Number", "Your National Insurance number is your own personal account number. The number makes sure that the National Insurance contributions and tax you pay are properly recorded against your name."])
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

// A function that retrieves all the acronyms and sends them to the home page
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
            let user_exists_error = "A user with this email already exists. Please login.";
            return res.render('register', { user_exists_error })
        }

        // Generating a salt for the password
        const salt = bcrypt.genSaltSync(10);
        // Hashing the password with the generated salt
        const hashedpassword = bcrypt.hashSync(password, salt);
        // Getting the current date and time
        const dateCreated = Date.now();

        // Inserting the new user into the database
        const insertSql = 'INSERT INTO Users (username, email, password, salt, date_created) VALUES (?,?,?,?,?)';
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

// A function that handles a post request to log in an existing user
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
                //Set session variables
                req.session.userId = user[0].user_id;
                req.session.username = user[0].username;
                req.session.isAdmin = user[0].is_admin;
                const username = user[0].username;
                //Reload home page with acronyms
                getAcronyms(req, res);
                });
        } catch (err) {
            console.log(err);
        }
    });
    alusDatabase.close();
}

// A function that handles a post request to store a new acronym suggestion
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

// A function that retrieves all the user suggestions and sends them to the suggestions page
const getSuggestions = (req, res) => {
    const alusDatabase = new sqlite3.Database(databaseSource);

    // Query the suggestions table to retrieve all suggestions
    alusDatabase.all('SELECT * FROM Suggestions', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving suggestions from database');
            return;
        }

        // Render the view-suggestions.njk page and pass the suggestions as context
        res.render('view-suggestions', { username: req.session.username, is_admin: req.session.isAdmin, suggestions: rows });
    });

    alusDatabase.close();
};

// A function that deletes a user suggestion by suggestion id
const deleteSuggestion = (req, res) => {
    const suggestion_id = req.body.suggestion_id;
    const alusDatabase = new sqlite3.Database(databaseSource);

    alusDatabase.run(`DELETE FROM Suggestions WHERE suggestion_id = ?`, suggestion_id, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error deleting suggestion from database');
        } else {
            console.log('Suggestion deleted');
            getSuggestions(req, res);
        }
    });

    alusDatabase.close();
};

const addSuggestion = (req, res) => {
    // Get the suggestion ID from the request
    const suggestion_id = req.body.suggestion_id;

    // Creating a new database connection
    const alusDatabase = new sqlite3.Database(databaseSource);

    // Update the suggestion
    alusDatabase.run(`UPDATE Suggestions SET is_approved = 1 WHERE suggestion_id = ?`, suggestion_id, function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error updating suggestion in database');
            return;
        }

        // Add the suggestion to the acronyms table
        const insertStatement = `INSERT INTO Acronyms (acronym, definition, description) 
                              SELECT acronym, definition, description FROM Suggestions 
                              WHERE suggestion_id = ?`;
        alusDatabase.run(insertStatement, suggestion_id, function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error adding suggestion to database');
                return;
            }
        alusDatabase.run(
            'DELETE FROM Suggestions WHERE suggestion_id = ?',
            [suggestion_id],
            (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error deleting suggestion from database');
                    return;
                }

            console.log(`Suggestion with ID ${suggestion_id} added to acronyms`);

            alusDatabase.close();

            // Reload suggestions and direct to the view suggestions page
            getSuggestions(req, res);
            });
        });
    });
};

const editSuggestion = (req, res) => {
    const suggestion_id = req.body.suggestion_id;
    const newAcronym = req.body.acronym;
    const newDefinition = req.body.definition;
    const newDescription = req.body.description;

    const alusDatabase = new sqlite3.Database(databaseSource);
    alusDatabase.run(
        `UPDATE Suggestions SET acronym=?, definition=?, description=? WHERE suggestion_id=?`,
        [newAcronym, newDefinition, newDescription, suggestion_id],
        (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error updating suggestion');
                return;
            }
            console.log(`Suggestion ${suggestion_id} updated`);
            alusDatabase.close();
            getSuggestions(req, res);
        }
    );
};

module.exports = {
    createDatabase,
    getAcronyms,
    postRegisterRequest,
    postLoginRequest,
    postSuggestion,
    getSuggestions,
    deleteSuggestion,
    addSuggestion,
    editSuggestion,
};
