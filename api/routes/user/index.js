const express = require('express');
const router = express.Router();
const setProfile = require('./setProfile');
const getProfile = require("./getProfile");
const post = require("./post");
const multer = require("../../middlewares/multerPost");
const getImages = require("./getListings");
const friendRequests = require("./friendRequests");
const friendRequest = require("./friendRequest");
const addFriend = require("./addFriend");
const getFriends = require('./getFriends');
const declineFriend = require("./declinerequest");
const nearme = require("./nearme");
const scoreboard = require("./scoreboard");

module.exports = function main() {
    router.post("/profileUpdate",express.json(), setProfile);
    router.get("/profile", getProfile);
    router.post("/post", multer.single("image"),express.json(), post);
    router.get("/images", getImages);
    router.get("/friendRequests",friendRequests);
    router.post("/friendRequest", express.json(),friendRequest);
    router.post("/addFriend", express.json(),addFriend);
    router.get("/getFriends", getFriends);
    router.post("/declineFriend", express.json(), declineFriend);
    router.post("/nearme", express.json(), nearme);
    router.get("/scoreboard", scoreboard)


    return router;
}