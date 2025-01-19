const express = require('express');
const path = require("path");
const query = require("../../db/access/query");
const router = express.Router();
const hash = require("../../services/hash");
const bcrypt = require("bcrypt");

module.exports = function main() {
    router.get("/createAcc",(req, res)=>res.sendFile(path.join(__dirname, '../../../test', 'acc_create.html')));
    router.get("/login", (req, res)=>res.sendFile(path.join(__dirname, '../../../test', 'login.html')));
    router.get("/sampleAcc", async (req, res) => {
        try {
            const {insertId} = await query({name: "create_user_main", params: ["7"]});
            await query({name: "create_user_login", params: [insertId, hash.email("demo@demo.com"), await hash.password("1")]});
            res.sendStatus(200);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    });

    router.get("/sampleAcc2", async (req, res) => {
        try {
            const {insertId} = await query({name: "create_user_main", params: ["9"]});
            await query({name: "create_user_login", params: [insertId, hash.email("demo2@demo.com"), await hash.password("1")]});
            res.sendStatus(200);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    });

    router.get("/profileChange",(req, res)=>res.sendFile(path.join(__dirname, '../../../test', 'profileChange.html')) )
    router.get("/post",(req, res)=>res.sendFile(path.join(__dirname, '../../../test', 'post.html')) )
    router.get("/friends",(req, res)=>res.sendFile(path.join(__dirname, '../../../test', 'friends.html')) )
    router.get("/lat",(req, res)=>res.sendFile(path.join(__dirname, '../../../test', 'lat.html')) )


    return router;
}