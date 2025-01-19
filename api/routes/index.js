const login = require("./login");
const create = require("./account_creation");
const uuid2password = require("./account_creation/finalize");
const finalise = require("./account_creation/setPassword");
const userRoutes = require("./user");
const test = require("./test");
const express = require("express");
const logout = require("./logout");
const shop = require("./shop");
const path = require("path");
const query = require("../db/access/query");
const crypto = require("crypto");

async function isLogged(req, res, next) {
    console.log(req.cookies);
    if (!req.session.user) {
        const ssid = crypto.randomBytes(16).toString("hex");
        const {insertId} = await query({name: "create_user_main", params: [ssid]});
        req.session.user = {
            slug: ssid,
            id: insertId
        };
        next();
    }
    else {
        next();
    }
}


module.exports = (app) => {
    app.post("/login", express.json(), login);
    app.post("/email2uuid", express.json(), create);
    app.post("/uuid2password", express.json(), uuid2password);
    app.post("/finalise", express.json(), finalise);
    app.post("/logout", logout);
    // app.get("/assets", (req, res) => res.sendFile(path.join(__dirname, '../../animal-tracker/dist/assets', 'index.html')))
    app.use(express.static(path.join(__dirname, '../../animal-tracker/dist')));

    app.use("/user", isLogged, userRoutes());
    app.use("/shop", shop);

    app.use("/test", test());

    app.use((req, res) => res.sendFile(path.join(__dirname, '../../animal-tracker/dist', 'index.html')));

    app.use((err, req, res, next) => {
        console.log(err);
        res.sendStatus(500);
    });
};