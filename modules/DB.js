module.exports = {
    'init' : function(app, connection){
        init(app, connection);
    }
}

function init(app, connection){
    app.all('/test', function (req, res) {
        console.log(req.path);

        connection.query('SELECT 1 FROM ACCOUNT', function (err, rows) {
            if (err) {
                throw err;
            }
            res.json(rows);
        });
    });
}