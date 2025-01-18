// yvrp tvkj keok bkxd

const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wildaround2@gmail.com', // Replace with your email
        pass: 'yvrp tvkj keok bkxd'    // Replace with your app password
    },
    debug: true,
    logger: true
});

/**
 * Sends an email using the configured transporter.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text content of the email.
 * @param {string} [html] - Optional HTML content for the email.
 *
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: 'windaround2@gmail.com', // Replace with your email
            to: to,                      // Recipient email address
            subject: subject,            // Email subject
            text: text,                  // Plain text content
            html: html                   // HTML content (optional)
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = sendEmail;

// Example usage:
// (async () => {
//     await sendEmail(
//         'recipient@example.com',       // Replace with recipient's email
//         'Test Email Subject',          // Replace with your subject
//         'This is a plain text email.', // Replace with your plain text content
//         '<p>This is an <b>HTML</b> email.</p>' // Replace with your HTML content (optional)
//     );
// })();