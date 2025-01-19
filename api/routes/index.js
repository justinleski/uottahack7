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

function isLogged(req, res, next) {
    console.log(req.cookies);
    if (!req.session.user) {
        res.sendStatus(403);
        return;
    }
    next();
}


module.exports = (app) => {
    app.post("/login", express.json(), login);
    app.post("/email2uuid", express.json(), create);
    app.post("/uuid2password", express.json(), uuid2password);
    app.post("/finalise", express.json(), finalise);
    app.post("/logout", logout);
    // app.get("/", (req, res) => res.sendFile(path.join(__dirname, '../../animal-tracker/dist', 'index.html')));
    // app.get("/assets", (req, res) => res.sendFile(path.join(__dirname, '../../animal-tracker/dist/assets', 'index.html')))
    app.use(express.static(path.join(__dirname, '../../animal-tracker/dist')));

    app.use("/user", isLogged, userRoutes());
    app.use("/shop", shop);

    app.use("/test", test());

    app.use((req, res) => {
        res.sendStatus(404);
    });

    app.use((err, req, res, next) => {
        console.log(err);
        res.sendStatus(500);
    });
};