const express = require("express");
const groceryRouter = express.Router();

const groceryController = require("../controllers/groceryListController.js");
const urlEncodedParser = express.urlencoded({extended: false});

groceryRouter.get("/list", groceryController.getGroceryListById);
groceryRouter.get("/lists", groceryController.getGroceryLists);
groceryRouter.get("/groceries", groceryController.getGroceriesFromList);
groceryRouter.post("/add", groceryController.addGroceryList);
groceryRouter.post("/remove", groceryController.removeGroceryList);
groceryRouter.post("/rename", groceryController.renameGroceryList);
groceryRouter.post("/grocery/add", groceryController.addGroceryToList);
groceryRouter.post("/grocery/amount/increment", groceryController.incrementGroceryAmount);
groceryRouter.post("/grocery/amount/decrement", groceryController.decrementGroceryAmount);
groceryRouter.get("/grocery/search", groceryController.searchProduct);
groceryRouter.post("/grocery/mark", groceryController.markGrocery);
groceryRouter.post("/grocery/unmark", groceryController.unMarkGrocery);


module.exports = groceryRouter;