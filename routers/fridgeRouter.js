const express = require("express");
const fridgeRouter = express.Router();

const urlEncodedParser = express.urlencoded({extended: false});

const fridgeController = require("../controllers/fridgeController.js");

fridgeRouter.get("/products", urlEncodedParser, fridgeController.getFridgeProducts);
fridgeRouter.post("/product/remove", urlEncodedParser, fridgeController.removePeoductFromFridge);

module.exports = fridgeRouter;