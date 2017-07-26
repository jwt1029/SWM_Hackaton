var mysql = require('mysql');

module.exports = {
    'init' : function(app, connection){
        init(app, connection);
    }
}

function init(app, connection){
    app.all('/createRecruit', function (req, res) {
        console.log(req.path);

        var title = req.body.title;         // Article title
        var body = req.body.body;           // Article body
        var category = req.body.category;   // Article category
        var positions = req.body.positions; // Member position

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
                        console.log(mysql.escape(positionData[k]));
                        values.push([idx, positionData[k]]);
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

    
    app.all('/getRecruitList', function (req, res) {
        console.log(req.path);

        connection.query('SELECT idx, title, category, isEnd FROM RECRUIT', function (err, rows) {
            if (err) {
                throw err;
            }
            res.json(rows);
        });
    });

    app.all('/getRecruitBody', function (req, res) {
        console.log(req.path);
        var idx = req.body.idx;         // Article title

        connection.query('SELECT * FROM RECRUIT where idx = ' + mysql.escape(idx), function (err, rec) {
            if (err) {
                throw err;
            }

            connection.query('SELECT position, isEnd FROM POSITIONS where rec_idx = ' + mysql.escape(idx), function (err, pos) {
                if (err) {
                    throw err;
                }
                rec[0]["positions"] = pos;
                res.json(rec);
                // jsondata.push(
                //     {positions: pos}
                // );
                // res.json(jsondata);
            });
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