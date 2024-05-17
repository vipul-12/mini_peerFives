const express = require("express");
const cors = require('cors');

const app = express();

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

app.get("/", (req, res) => {
    res.status(200).json({ "message": "server is running" })
})

app.listen(8080, () => {
    console.log("server running on port 8080");
});