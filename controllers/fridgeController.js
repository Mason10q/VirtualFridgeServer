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


exports.getFridgeProducts = (req, res) => {
    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;

    let query = "SELECT F.fridge_id, P.product_name, F.product_id FROM FridgeProducts AS F JOIN Products AS P ON P.id = F.product_id WHERE F.fridge_id = (SELECT id FROM Fridges WHERE family_id = ?) LIMIT ? OFFSET ?";
    let db = getDb();

    db.connect();

    db.query(query, [req.query.family_id, limit, offset], (err, rows, fields) => {
        console.log(err);
        res.json(rows);
    });

    db.end();
};

exports.removePeoductFromFridge = (req, res) => {
    let query = "DELETE FROM FridgeProducts WHERE fridge_id = ? AND product_id = ?";
    let db = getDb();

    db.connect();

    db.query(query, [req.query.fridge_id, req.query.product_id], (err, rows, fields) => {
        console.log(err);
        res.send();
    });

    db.end();
};