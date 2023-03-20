const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3').verbose()
const databaseSource = "alus.db"
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);

const createDatabase = () => {
    const alusDatabase = new sqlite3.Database(databaseSource, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message)
            throw err
        }
        else {

            console.log('making db');
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
                        console.log('table exists')
                        // Table already created
                    } else{
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
            alusDatabase.close();
        }
    });
}

const insertOne = (userInfo) => {
    const {
        name,
        email,
        password,
    } = userInfo
    const alusDatabase = new sqlite3.Database(databaseSource, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message)
            throw err
        }
        else {
            console.log('connection success!')
        }
        const insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
        alusDatabase.run(insert, [name, email, bcrypt.hashSync(password, salt), salt, Date('now')])
        alusDatabase.close();
});
}

const postRegisterRequest = async (req, res) => {
    const alusDatabase = new sqlite3.Database(databaseSource, async (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message)
            throw err
        } else {
            console.log('connection success!')
        }
        const errors = []
        try {
            const {Username, Email, Password} = req.body;

            if (!Username) {
                errors.push("Username is missing");
            }
            if (!Email) {
                errors.push("Email is missing");
            }
            if (errors.length) {
                res.status(400).json({"error": errors.join(",")});
                return;
            }
            let userExists = false;


            const sql = "SELECT * FROM Users WHERE Email = ?"
            await alusDatabase.all(sql, Email, (err, result) => {
                if (err) {
                    res.status(402).json({"error": err.message});
                    return;
                }

                if (result.length === 0) {

                    const salt = bcrypt.genSaltSync(10);

                    const data = {
                        Username: Username,
                        Email: Email,
                        Password: bcrypt.hashSync(Password, salt),
                        Salt: salt,
                        DateCreated: Date('now')
                    }

                    const sql = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                    const params = [data.Username, data.Email, data.Password, data.Salt, Date('now')]
                    const user = alusDatabase.run(sql, params, function (err, innerResult) {
                        if (err) {
                            res.status(400).json({"error": err.message})
                            return;
                        }

                    });
                } else {
                    userExists = true;
                    // res.status(404).send("User Already Exist. Please Login");
                }
            });

            setTimeout(() => {
                if (!userExists) {
                    res.status(201).json("Success");
                } else {
                    res.status(400).json("Record already exists. Please login");
                }
            }, 500);


        } catch (err) {
            console.log(err);
        }
        alusDatabase.close();
    });

}

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

                const passwordMatch = await bcrypt.compare(Password, user[0].Password);

                if (passwordMatch === false) {
                    console.log('passwords dont match');
                    return res.status(400).send("No Match");
                } else {
                    console.log('passwords match');
                    const token = jwt.sign(
                        {user_id: user[0].Id, username: user[0].Username, Email},
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                        }
                    );

                    user[0].Token = token;
                    return res.status(200).send(user);
                }
            });

        } catch (err) {
            console.log(err);
        }
    });
    alusDatabase.close();
}


module.exports = {
    createDatabase,
    insertOne,
    postRegisterRequest,
    postLoginRequest,
};
