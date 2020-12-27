var mysql = require('mysql');
var util = require('util');
var moment = require('moment');

var con = mysql.createConnection({
    host: "localhost",
    user: "omun",
    password: "omun123",
    database: "test_db",
    dateStrings: true
});

con.on('connect', (err) => {
    if (err) throw err;
    console.log("MYSQL DB Connected!");
    
})

con.connect();

let query = async (q) => {
    let query = util.promisify(con.query).bind(con);
    let result = await query(q);
    return result;
}

let printResult = async (q) => {
    let result1 = await query(q);
    console.log(result1);
}

let dateMoment = moment().utc()
console.log("dateMoment", dateMoment);
let momentFormat = dateMoment.format('YYYY-MM-DD HH:mm:ss');
console.log("momentFormat", momentFormat);
let momentDateFromFormat = moment.utc(momentFormat);
console.log("momentDateFromFormat", momentDateFromFormat);
let localDate = moment(momentDateFromFormat).local().format('YYYY-MM-DD HH:mm:ss');
console.log("localDate", localDate);
// printResult('INSERT INTO ts (val, timestamp) VALUES ("HELLO", "' + momentNow + '")');
// printResult('INSERT INTO ts (val) VALUES ("HELLO")');
// printResult('SELECT * FROM ts');