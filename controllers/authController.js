const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const verificationCodes = new Map();

function getConfig() {
    return dotenv.config({ path: __approot + '/.env' });
}

function getEmailOptions(email, code) {
    let config = getConfig();

    return {
        from: config.parsed.EMAIL,
        to: email,
        subject: 'Код для проверки',
        text: `Ваш код для проверки: ${code}`
    };
}

function getTransporter() { 
    let config = getConfig();

    return nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: config.parsed.EMAIL,
            pass: config.parsed.EMAIL_PASS
        }
    });
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

exports.sendVerificationCode = (req, res) => {
    const email = req.query.email;
    const code = Math.floor(1000 + Math.random() * 9000);
    console.log(code);

    let transporter = getTransporter();
    let options = getEmailOptions(email, code);


    verificationCodes.set(email, code);

    transporter.sendMail(options, function(error, info) {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Message sent');
        transporter.close();
    });
}


exports.checkCode = (req, res) => {
    let db = getDb();
    let email = req.query.email;
    let code = req.query.code;

    console.log(`присланный ${code} хранящийся ${verificationCodes.get(email)}`);
    
    const familyQuery = "INSERT INTO Families VALUES () RETURNING id";
    const userQuery = "INSERT INTO Users (user_email, family_id) VALUES (?, ?)"
    const checkQuery = "SELECT family_id FROM Users WHERE user_email = ?"
    const fridgeQuery = "INSERT INTO Fridges (family_id) VALUES (?)"
    let familyId = -1;
    const verified = { "verified": false, "familyId": familyId }


    if(verificationCodes.get(email) == code) {
        db.connect();

        db.query(checkQuery, [email], (err, rows, fields) => {
            if(rows != undefined && rows.length == 0) {
                db.query(familyQuery, (err, rows, fields) => {
                    familyId = rows[0].id;
        
                    verified["verified"] = true
                    verified["familyId"] = familyId;
        
                    db.query(fridgeQuery, [familyId], (err, rows, fields) => {});
            
                    db.query(userQuery, [email, familyId], (err, rows, fields) => {
                        console.log(verified);
                        res.json(verified);
                        db.end();
                    });  
                }); 
            } else {
                familyId = rows[0].family_id;
                verified["verified"] = true
                verified["familyId"] = familyId;
                res.json(verified);
                db.end();
            }
        });
    } else {
        res.json(verified);
    }
}