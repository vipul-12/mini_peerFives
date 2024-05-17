const express = require("express");
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const allowedHosts = ['http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {        
        if (allowedHosts.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

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

app.put("/editUser", (req, res) => {
    const userId = req.body.id;
    const userName = req.body.name;

    if (!userId) {
        return res.status(400).json({ "error": "User ID is required" });
    }

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

    const sql = `UPDATE users SET name = ? WHERE id = ?`;

    db.run(sql, [userName, userId], function (err) {
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

        if (this.changes === 0) {
            return res.status(404).json({ "error": "User not found" });
        }

        res.status(200).json({
            "message": "User updated successfully",
            "user": {
                "id": userId,
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


app.get("/userDetails/:id", (req, res) => {
    const db = new sqlite3.Database('./database/db.sqlite3', sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            return res.status(500).json({ "error": error.message });
        } else {
            console.log("Database connected");
        }
    });

    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [req.params.id], (error, row) => {
        if (error) {
            return res.status(500).json({ "error": error.message });
        }
        res.json(row);
    });

    db.close();
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
});

app.post("/addRewardTransaction", (req, res) => {
    const { givenBy, givenTo, points } = req.body;

    const db = new sqlite3.Database('./database/db.sqlite3', sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            return res.status(500).json({ "error": error.message });
        } else {
            console.log("Database connected");
        }
    });

    db.get(
        `SELECT p5Balance FROM users WHERE id = ?`,
        [givenBy],
        (err, row) => {
            if (err) {
                return res.status(500).json({ "error": err.message });
            }

            if (!row || row.p5Balance < points) {
                return res.status(400).json({ "error": "Insufficient balance" });
            }

            db.run('BEGIN TRANSACTION');

            db.run(
                `UPDATE users 
                 SET p5Balance = p5Balance - ? 
                 WHERE id = ?`,
                [points, givenBy],
                function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ "error": err.message });
                    }

                    db.run(
                        `UPDATE users 
                         SET rewardBalance = rewardBalance + ? 
                         WHERE id = ?`,
                        [points, givenTo],
                        function (err) {
                            if (err) {
                                db.run('ROLLBACK');
                                return res.status(500).json({ "error": err.message });
                            }

                            db.run(
                                `INSERT INTO "reward history" (timeStamp, points, givenBy, givenTo) 
                                 VALUES (date('now'), ?, ?, ?)`,
                                [points, givenBy, givenTo],
                                function (err) {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        return res.status(500).json({ "error": err.message });
                                    }

                                    db.run('COMMIT', (err) => {
                                        if (err) {
                                            return res.status(500).json({ "error": err.message });
                                        }
                                        console.log("Transaction completed");
                                        res.status(200).json({ "message": "Transaction completed successfully" });
                                    });
                                }
                            );
                        }
                    );
                }
            );

        }
    );

    db.close();
});


app.listen(8080, () => {
    console.log("server running on port 8080");
});