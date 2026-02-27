const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images and PDFs only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(400).send({ message: err });
        }
        if (!req.file) {
            console.error("No file received");
            return res.status(400).send({ message: "No file uploaded" });
        }
        console.log("File uploaded successfully:", req.file.path);
        next();
    });
}, (req, res) => {
    res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;
