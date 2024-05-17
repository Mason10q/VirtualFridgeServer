const express = require("express");
const multer  = require("multer");

const mainRouter = require("./routers/mainRouter.js");

global.__approot = __dirname;

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, __dirname + "/public/images/");
    },
    filename: (req, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
 
const app = express();

app.use(multer({storage: storageConfig}).single("image"));
app.use("/public/", express.static(__dirname + '/public/'));

app.use(express.json())

app.use("", mainRouter);

app.listen(3000);