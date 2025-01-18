const ROUNDS = 10;

const crypto = require("crypto");
const bcrypt = require('bcrypt');

const hash_email = (email) => crypto.createHash('sha256').update(email).digest('hex');
const hash_password = async (password) => await bcrypt.hash(password, ROUNDS);
const hash_answer = async (answer) => await bcrypt.hash(answer, 10);

module.exports = {
    email: hash_email,
    password: hash_password,
    answer: hash_answer,
    OTP() {
        const randomBytes = crypto.randomBytes(4).readUInt32BE(0); // 4 bytes = 32-bit integer
        return (randomBytes % 1000000).toString().padStart(6, '0'); // Ensure it's a 6-digit code
    }
}