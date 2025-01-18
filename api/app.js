require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes");
const session = require("express-session");
const {RedisStore} = require('connect-redis');  // Use .default for newer versions
const cookieParser = require('cookie-parser');
const crypto = require("crypto");

const app = express();
const redisClient = require("./redisClient");

app.disable('etag');

// Set up body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(csrfProtection);
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(session({
    name: "sid",
    secret: "secret",
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: false,
        maxAge: Number(process.env.SERVER_INACTIVITY_TIMEOUT),
        sameSite: 'Lax',
        httpOnly: true
    } // Set secure: true if using HTTPS
}));

routes(app);

// Start the server
const PORT = process.argv[2] || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    process.exit(0);

    // If still running after 10 seconds, force shutdown
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
});