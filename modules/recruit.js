var mysql = require('mysql');

module.exports = {
    'init' : function(app, connection){
        init(app, connection);
    }
}

function init(app, connection){
    app.all('/createRecruit', function (req, res) {
        console.log(req.path);

        var title = req.body.title;        // Article title
        var body = req.body.body;   // Article body
        var category = req.body.category; // Article category
        var positions = req.body.positions;

        connection.query('INSERT INTO RECRUIT (title, body, category) VALUES (' + mysql.escape(title) + ',' + mysql.escape(body) + ',' + mysql.escape(category) + ');', function (err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    message: '게시글 작성 오류 발생'
                });
            }
            else {
                var positionData = JSON.parse(positions);
                getLastInsertId(function(idx) {
                    var values = [];
                    for(var k in positionData) {
                        values.push([idx, mysql.escape(positionData[k])]);
                    }
                    connection.query('INSERT INTO POSITIONS (rec_idx, position) VALUES ?', [values] , function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.json({
                                success: false,
                                message: '카테고리 입력 오류 발생'
                            });
                        }
                        else {
                            res.json({
                                success: true,
                                message: null
                            });
                        }

                    });
                });
            }
        });

    });

    function getLastInsertId(callback) {
        connection.query('SELECT LAST_INSERT_ID() as idx;', function (err, rows) {
            if (err) {
                throw err;
            }
            callback(rows[0].idx);
            return rows[0].idx;
        });
    }

}