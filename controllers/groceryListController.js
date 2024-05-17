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


exports.getGroceryLists = (req, res) => {
    let db = getDb();
    let query = "SELECT * FROM GroceryLists WHERE family_id = ?";
    
    db.connect();

    db.query(query, [req.query.family_id], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        res.json(rows);   
    });

    db.end()
}


exports.getGroceriesFromList = (req, res) => {
    let db = getDb();
    let query = "SELECT G.productId, P.product_name, G.amount, G.marked FROM Groceries as G JOIN Products AS P ON G.product_id = P.id WHERE family_id = ? AND groceryList_id = ?";
    
    db.connect();

    db.query(query, [req.query.family_id, req.query.groceryListId], (err, rows, fields) => {
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

    db.query(query, [req.query.groceryListId, req.query.productId], (err, rows, fields) => {
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
    let query = "SELECT G.product_id, P.product_name, G.amount, G.marked FROM Groceries AS G RIGHT JOIN Products AS P ON G.product_id = P.id WHERE P.product_name LIKE ?";
    
    db.connect();

    db.query(query, [`${req.query.query}%`], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        res.json(rows);   
    });

    db.end()
}


exports.markGroceryInList = (req, res) => {
    let db = getDb();
    let query = "UPDATE Groceries SET marked = 1 WHERE groceryList_id = ? AND product_id = ?";
    
    db.connect();

    db.query(query, [req.query.groceryListId, req.query.productId], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}

exports.unmarkGroceryInList = (req, res) => {
    let db = getDb();
    let query = "UPDATE Groceries SET marked = 0 WHERE groceryList_id = ? AND product_id = ?";
    
    db.connect();

    db.query(query, [req.query.groceryListId, req.query.productId], (err, rows, fields) => {
        res.send();   
    });

    db.end()
}