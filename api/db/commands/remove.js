require('dotenv').config();
const fs = require('fs'); // For file system operations
const mysql = require('mysql2/promise'); // For connecting to the database

// Database configuration
const dbConfig = {
    host: '127.0.0.1', // Replace with your database host
    user: 'root',      // Replace with your database username
    password: process.env.NIKOLAI ? '06192352' : ''      // Replace with your database password
};

// Function to execute SQL script
async function executeSQLFromFile(filePath) {
    try {
        // Read the SQL file
        const sqlScript = fs.readFileSync(filePath, 'utf8');

        // Connect to the database
        const connection = await mysql.createConnection(dbConfig);

        console.log('Connected to the database.');

        // Split the SQL script into individual statements (handle multiple commands)
        const sqlStatements = sqlScript.split(';').filter((stmt) => stmt.trim().length);

        // Execute each statement
        for (let statement of sqlStatements) {
            console.log(`Executing: ${statement.trim()}`);
            await connection.query(statement.trim());
        }

        console.log('SQL script executed successfully.');

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error(error);
    }
}

// Specify the path to your SQL file
const sqlFilePath = './db/commands/remove.sql'; // Replace with the actual path
executeSQLFromFile(sqlFilePath);