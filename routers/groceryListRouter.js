const express = require("express");
const groceryRouter = express.Router();

const groceryController = require("../controllers/groceryListController.js");


groceryRouter.get("/lists", groceryController.getGroceryLists);
groceryRouter.get("/groceries", groceryController.getGroceriesFromList);
groceryRouter.post("/add", groceryController.addGroceryList);
groceryRouter.post("/remove", groceryController.removeGroceryList);
groceryRouter.post("/rename", groceryController.renameGroceryList);
groceryRouter.post("/grocery/add", groceryController.addGroceryToList);
groceryRouter.post("/grocery/amount/increment", groceryController.incrementGroceryAmount);
groceryRouter.post("/grocery/amount/decrement", groceryController.decrementGroceryAmount);
groceryRouter.get("/grocery/search", groceryController.searchProduct);
groceryRouter.post("/grocery/mark", groceryController.markGroceryInList);
groceryRouter.post("/grocery/unmark", groceryController.unmarkGroceryInList);


module.exports = groceryRouter;