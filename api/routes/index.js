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
    // console.log(req.cookies, "1231232");
    // console.log(req.session.user, "1232123123");
    // if (!req.session.user) {
    //     res.sendStatus(403);
    //     return;
    // }
    // else {
    //     return next();
    // }
}


module.exports = (app) => {
    app.post("/login", express.json(), login);
    app.post("/email2uuid", express.json(), create);
    app.post("/uuid2password", express.json(), uuid2password);
    app.post("/finalise", express.json(), finalise);
    app.post("/logout", logout);
    // app.get("/assets", (req, res) => res.sendFile(path.join(__dirname, '../../animal-tracker/dist/assets', 'index.html')))
    app.use(express.static(path.join(__dirname, '../../animal-tracker/dist')));

    app.use("/user", userRoutes());
    app.use("/shop", shop());

    app.use("/login2", (req, res)=>{
        console.log(1);
        req.session.user = {
            id: 1,
            uuid: "leopard"
        };
        res.sendStatus(200);
    });

    app.use((req, res) => res.sendFile(path.join(__dirname, '../../animal-tracker/dist', 'index.html')));

    app.use((err, req, res, next) => {
        console.log(err);
        res.sendStatus(500);
    });
};