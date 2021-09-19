// database module
var mysql = require('mysql');

//login server
var config = {
    host: 'shop-do-user-9342162-0.b.db.ondigitalocean.com',
    user: 'dathuynh',
    password : 'Dathuynh$1909',
    database: 'shop_sever',
    sslmode: 'REQUIRED',
    port: '25060'
};

// call first data setup
var pool = mysql.createPool(config);

//Fetch data from mysql server
function RunQuery(sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            ShowErrors(err);
        }
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                ShowErrors(err);
            }
            conn.release();
            callback(rows);
        });
    });
}

//handle err
function ShowErrors(err) {
    throw err;
}

module.exports = {
    RunQuery: RunQuery
};