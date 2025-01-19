const express = require('express');
const router = express.Router();
const getAvatars = require('./getAvatars');
const getHats = require('./getHats');
const buyAvatar = require('./buyAvatar');
const buyHat = require('./buyHat');

module.exports = function main() {
    router.get("/hats", getHats);
    router.post("/buyHat",express.json(), buyHat);
    router.get("/avatars", getAvatars);
    router.post("/buyAvatar",express.json(), buyAvatar);

    return router;
}