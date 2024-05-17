const express = require("express");
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const allowedHosts = ['http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the allowed hosts array
        if (allowedHosts.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get("/pragma", (req, res) => {
    const db = new sqlite3.Database('./database/db.sqlite3', sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            return console.error(error.message);
        } else {
            console.log("Database connected");
        }
    });

    db.all("PRAGMA table_info(users);", [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.status(200).json(rows);

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log("Database connection closed");
        });
    });
})

app.post("/newUser", (req, res) => {
    const userName = req.body.name;

    if (!userName) {
        return res.status(400).json({ "error": "Name is required" });
    }

    const db = new sqlite3.Database('./database/db.sqlite3', sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            return res.status(500).json({ "error": error.message });
        } else {
            console.log("Database connected");
        }
    });

    const sql = `INSERT INTO users (name) VALUES (?)`;

    db.run(sql, [userName], function (err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log("Database connection closed");
            });
            return;
        }

        res.status(201).json({
            "message": "User created successfully",
            "user": {
                "id": this.lastID,
                "name": userName
            }
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log("Database connection closed");
        });
    });
});

app.get("/", (req, res) => {
    const db = new sqlite3.Database('./database/db.sqlite3', sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            return res.status(500).json({ "error": error.message });
        } else {
            console.log("Database connected");
        }
    });

    const sql = `SELECT * FROM users`;

    db.all(sql, [], function (err, rows) {
        if (err) {
            res.status(500).json({ "error": err.message });
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log("Database connection closed");
            });
            return;
        }

        res.status(200).json(rows);

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log("Database connection closed");
        });
    })
})

app.listen(8080, () => {
    console.log("server running on port 8080");
});