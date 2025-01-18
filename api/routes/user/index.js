const express = require('express');
const router = express.Router();
const setProfile = require('./setProfile');
const getProfile = require("./getProfile");
const post = require("./post");
const multer = require("../../middlewares/multerPost");

module.exports = function main() {
    router.post("/profileUpdate", setProfile);
    router.get("/profile", getProfile);
    router.post("/post", multer.single("image"), post);


    return router;
}