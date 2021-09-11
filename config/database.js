// database module
var mysql = require('mysql');

var config = {
    host: 'shop-do-user-9342162-0.b.db.ondigitalocean.com',
    user: 'dathuynh',
    password : 'Dathuynh$1909',
    database: 'shop_sever',
    sslmode: 'REQUIRED',
    port: '25060'
};

// init database
var pool = mysql.createPool(config);

//Fetch data
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

//Throw errors
function ShowErrors(err) {
    throw err;
}

module.exports = {
    RunQuery: RunQuery
};