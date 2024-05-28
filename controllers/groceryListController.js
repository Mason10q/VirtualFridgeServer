const mysql = require('mysql');
const dotenv = require('dotenv');

function getConfig() {
    return dotenv.config({ path: __approot + '/.env' });
}

function getDb() {
    let config = getConfig();
    return mysql.createConnection({
        host: config.parsed.DB_HOST,
        user: config.parsed.DB_USER,
        database: config.parsed.DB_NAME,
        password: config.parsed.DB_PASS
    });
}


exports.getGroceryListById = (req, res) => {
    let db = getDb();

    let query = "SELECT GL.id, GL.name, COUNT(G.groceryList_id) AS products_amount, SUM(CASE WHEN G.marked = 1 THEN 1 ELSE 0 END) AS products_marked FROM GroceryLists AS GL LEFT JOIN Groceries AS G ON GL.id = G.groceryList_id WHERE id = ?";
    
    db.connect();

    db.query(query, [req.query.listId], (err, rows, fields) => {
        res.json(rows[0]);   
    });

    db.end()
}


exports.getGroceryLists = (req, res) => {
    let db = getDb();
    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;

    let query = "SELECT GL.id, GL.name, COUNT(G.groceryList_id) AS products_amount, SUM(CASE WHEN G.marked = 1 THEN 1 ELSE 0 END) AS products_marked FROM GroceryLists AS GL LEFT JOIN Groceries AS G ON GL.id = G.groceryList_id WHERE family_id = ? GROUP BY GL.id, GL.name LIMIT ? OFFSET ?";
    
    db.connect();

    db.query(query, [req.query.family_id, limit, offset], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        res.json(rows);   
    });

    db.end()
}


exports.getGroceriesFromList = (req, res) => {
    let db = getDb();
    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;

    let query = "SELECT G.product_id AS productId, P.product_name AS name, G.amount, G.marked FROM Groceries as G JOIN Products AS P ON G.product_id = P.id WHERE groceryList_id = ? LIMIT ? OFFSET ?";
    
    db.connect();

    db.query(query, [req.query.listId, limit, offset], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        res.json(rows);   
    });

    db.end()
}

exports.addGroceryList = (req, res) => {
    let db = getDb();
    let query = "INSERT INTO GroceryLists (family_id, name) VALUES (?, ?)";
    
    db.connect();

    db.query(query, [req.query.family_id, req.query.name], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}


exports.removeGroceryList = (req, res) => {
    let db = getDb();
    let query = "DELETE FROM GroceryLists WHERE id = ?";
    
    db.connect();

    db.query(query, [req.query.id], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}

exports.renameGroceryList = (req, res) => {
    let db = getDb();
    let query = "UPDATE GroceryLists SET name = ? WHERE id = ?";
    
    db.connect();

    db.query(query, [req.query.name, req.query.id], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}

exports.addGroceryToList = (req, res) => {
    let db = getDb();
    let query = "INSERT INTO Groceries (groceryList_id, product_id) VALUES (?, ?);";
    
    db.connect();

    db.query(query, [req.query.listId, req.query.productId], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}

exports.incrementGroceryAmount = (req, res) => {
    let db = getDb();
    let query = "UPDATE Groceries SET amount = amount + 1 WHERE groceryList_id = ? AND product_id = ?";
    
    db.connect();

    db.query(query, [req.query.groceryListId, req.query.productId], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}

exports.decrementGroceryAmount = (req, res) => {
    let db = getDb();
    let query = "UPDATE Groceries SET amount = amount - 1 WHERE groceryList_id = ? AND product_id = ?";
    
    db.connect();

    db.query(query, [req.query.groceryListId, req.query.productId], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}


exports.searchProduct = (req, res) => {
    let db = getDb();
    let page = req.query.page;
    let listId = req.query.listId;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;

    let query = "SELECT P.id AS productId, P.product_name AS name, G.amount, G.marked FROM Products AS P LEFT JOIN Groceries AS G ON P.id = G.product_id AND G.groceryList_id = ? WHERE P.product_name LIKE ? LIMIT ? OFFSET ?";
    
    db.connect();

    db.query(query, [listId, `${req.query.query}%`, limit, offset], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        res.json(rows);   
    });

    db.end()
}

exports.markGrocery = (req, res) => {
    let db = getDb();
    let product_id = req.query.productId;
    let listId = req.query.listId;

    let query = "UPDATE Groceries SET marked = 1 WHERE groceryList_id = ? AND product_id = ?";
    let fridgeQuery = "INSERT INTO FridgeProducts (fridge_id, product_id) VALUES ((SELECT id FROM Fridges WHERE family_id = (SELECT family_id FROM GroceryLists WHERE id = ? LIMIT 1) LIMIT 1), ?)";

    db.connect();

    db.query(query, [listId, product_id], (err, rows, fields) => {
        console.log(err);
        db.query(fridgeQuery, [listId, product_id], (err, rows, fields) => {
            console.log(err);
            db.end();
            res.send();
        });
    });

};


exports.unMarkGrocery = (req, res) => {
    let db = getDb();

    let product_id = req.query.productId;
    let listId = req.query.listId;

    let query = "UPDATE Groceries SET marked = 0 WHERE groceryList_id = ? AND product_id = ?";
    let removeQuery = "DELETE FROM FridgeProducts WHERE fridge_id = (SELECT id FROM Fridges WHERE family_id = (SELECT family_id FROM GroceryLists WHERE id = ? LIMIT 1) LIMIT 1) AND product_id = ?";

    db.connect();

    db.query(query, [listId, product_id], (err, rows, fields) => {
        console.log(err);

        db.query(removeQuery, [listId, product_id], (err, rows, fields) => {
            console.log(err);
            db.end();
            res.send();
        });
    });
}