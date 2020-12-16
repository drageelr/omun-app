'use strict'

var mysql = require('mysql');
var util = require('util');
var hFuncs = require('./helper-funcs');
var { vars } = require('../config/config');

var con = mysql.createConnection({
    host: "localhost",
    user: vars.dbUser,
    password: vars.dbPassword,
    database: vars.dbName,
});

con.on('connect', (err) => {
    if (err) throw err;
    console.log("MYSQL DB Connected!");
    
})

module.exports.con = con;
module.exports.query = async (q) => {
    let query = util.promisify(con.query).bind(con);
    let result = await query(q);
    return result;
}
module.exports.defaultAdmin = async () => {
    let query = util.promisify(con.query).bind(con);

    let adminCount = await query("SELECT count(*) FROM admin");

    if (adminCount[0]['count(*)']) { return; }

    await query('INSERT INTO admin (name, email, password) VALUES ("Default Admin", "admin@omunapp.com", "' + hFuncs.hash("Test12345") + '")');
    console.log("Default Admin Created: admin@omunapp.com Test12345");
}