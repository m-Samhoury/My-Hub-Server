constants = require("./constants");

const express = require("express");
const app = express();
const path = require('path');
const dirTree = require("directory-tree");
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadMediaLimits = {
    fieldNameSize: 100,
    files: 2,
    fields: 5,
    fileSize: 3 * 1024 * 1024 // 3 MB max
};

const upload = multer({storage: storage}, {limits: uploadMediaLimits}).single('hub');
app.use('/uploads', express.static('uploads'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.json(
                {
                    "status": "failed",
                    "successful": false,
                    "message": err.message
                });
        }
        res.json({
            "status": "succeeded",
            "successful": true,
            "message": "File has been uploaded successfully",
            "data": {
                "imageUrl": constants.URL + req.file.path
            }
        });
    });
});


app.get('/api/uploads', function (req, res) {
    res.json(dirTree('uploads', ['.jpg', '.png'], (item, PATH, stats) => {
        item.imageUrl = constants.URL + item.path
    }));
});

app.listen(3000, constants.IP, function () {
    console.log("Working on: " + constants.URL);
});



