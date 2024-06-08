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

function pathFromFileName(filename) {
    return `public/images/${filename}`;
}



exports.getRecipes = (req, res) => {
    let db = getDb();
    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;

    let query = "SELECT R.id, R.recipe_name, R.calories, R.image_url, D.difficulty_name, SEC_TO_TIME(SUM(TIME_TO_SEC(CS.needed_time))) AS total_cooking_time FROM Recipes AS R JOIN Difficulties AS D ON D.id = R.difficulty_id JOIN RecipeSteps AS RS ON RS.recipe_id = R.id JOIN CookingSteps AS CS ON RS.cooking_step_id = CS.id GROUP BY R.id, R.recipe_name, R.calories, R.image_url, D.difficulty_name LIMIT ? OFFSET ? ";

    db.connect();

    db.query(query, [limit, offset], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        rows.map((image) => { image, image.image_url = pathFromFileName(image.image_url); });

        res.json(rows);   
    });

    db.end();
}


exports.searchRecipes = (req, res) => {
    let db = getDb();
    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;
    let query = req.query.query;
    let dbQuery = "SELECT R.id, R.recipe_name, R.calories, R.image_url, D.difficulty_name, SEC_TO_TIME(SUM(TIME_TO_SEC(CS.needed_time))) AS total_cooking_time FROM Recipes AS R JOIN Difficulties AS D ON D.id = R.difficulty_id JOIN RecipeSteps AS RS ON RS.recipe_id = R.id JOIN CookingSteps AS CS ON RS.cooking_step_id = CS.id WHERE recipe_name LIKE ? GROUP BY R.id, R.recipe_name, R.calories, R.image_url, D.difficulty_name LIMIT ? OFFSET ?";

    db.connect();

    db.query(dbQuery, [`%${query}%`, limit, offset], (err, rows, fields) => {
        if(rows === undefined) { console.log(err); return;}

        rows.map((image) => { image, image.image_url = pathFromFileName(image.image_url); });

        res.json(rows);   
    });

    db.end();
}


exports.getRecipe = (req, res) => {
    let db = getDb();
    let query = "SELECT R.id, R.recipe_name, R.description, R.calories, R.image_url, D.difficulty_name, SEC_TO_TIME(SUM(TIME_TO_SEC(CS.needed_time))) AS total_cooking_time FROM Recipes AS R JOIN Difficulties AS D ON D.id = R.difficulty_id JOIN RecipeSteps AS RS ON RS.recipe_id = R.id JOIN CookingSteps AS CS ON RS.cooking_step_id = CS.id WHERE R.id = ?";

    db.connect();

    db.query(query, [req.query.recipe_id], (err, rows, fields) => {
        rows.map((image) => { image, image.image_url = pathFromFileName(image.image_url); });

        res.json(rows[0]);
    });

    db.end();
}


exports.getRecipeProducts = (req, res) => {
    let db = getDb();
    let query = "SELECT DISTINCT P.product_name, CSP.amount, (P.id IN (SELECT FP.product_id FROM FridgeProducts AS FP WHERE FP.fridge_id = (SELECT id FROM Fridges WHERE family_id = ?))) AS is_in_fridge FROM RecipeSteps AS RS JOIN CookingStepProducts AS CSP ON RS.cooking_step_id = CSP.cooking_step_id JOIN Products AS P ON P.id = CSP.product_id WHERE RS.recipe_id = ?";

    db.connect();

    db.query(query, [req.query.family_id, req.query.recipe_id], (err, rows, fields) => {
        res.json(rows);
    });

    db.end();
}