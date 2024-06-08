const express = require("express");
const multer  = require("multer");

const groceryRouter = require("./routers/groceryListRouter.js");
const authRouter = require("./routers/authRouter.js");
const fridgeRouter = require("./routers/fridgeRouter.js");
const recipeRouter = require("./routers/recipeRouter.js");

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

app.use("/groceryList", groceryRouter);
app.use("/auth", authRouter);
app.use("/fridge", fridgeRouter);
app.use("/recipes", recipeRouter);

app.listen(3000);