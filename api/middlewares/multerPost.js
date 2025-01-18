const multerPost = require("multer");

// Multer configuration
const upload = multerPost({
    // Memory storage (keeps file in memory as a buffer)
    storage: multerPost.memoryStorage(),

    // File size limit (20MB)
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
    },

    // File filter (JPEG only)
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg"];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error("Only JPEG images are allowed."), false); // Reject the file
        }
    },
});

module.exports = upload;