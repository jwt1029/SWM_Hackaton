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
        var master = req.body.userKey;   // Article category
        var body = req.body.body;           // Article body
        var category = req.body.category;   // Article category
        var positions = req.body.positions; // Member position

        connection.query('INSERT INTO RECRUIT (master, title, body, category) VALUES (' + master + ',' + mysql.escape(title)
                + ',' + mysql.escape(body) + ',' + mysql.escape(category) + ');', function (err, rows) {
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

        connection.query('SELECT idx, master, title, category, isEnd FROM RECRUIT', function (err, rows) {
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
            });
        });
    });

    app.all('/applyRecruit', function (req, res) {
        console.log(req.path);
        var rec_idx = req.body.idx;         // Article index
        var userKey = req.body.userKey;     // User key
        var position = req.body.position;     // User key

        connection.query('SELECT COUNT(*) as count FROM RECRUIT_STATE WHERE userKey = ' + mysql.escape(userKey) + ' AND rec_idx = ' + mysql.escape(rec_idx), function (err, rows) {
            if (err) {
                throw err;
            }
            
            if(rows[0].count > 0) {
                res.json({
                    success: false,
                    message: '이미 해당 팀에 신청하였습니다.'
                });
            }
            else {
                connection.query('INSERT INTO RECRUIT_STATE (userKey, rec_idx, position) VALUES (' + mysql.escape(userKey) + ', ' + mysql.escape(rec_idx) + ', ' + mysql.escape(position) + ')', function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.json({
                            success: false,
                            message: '신청 에러 발생. 잠시 후 다시 시도해주세요.'
                        });
                    }
                    else {
                        res.json({
                            success: true,
                            message: '신청이 완료되었습니다.'
                        });
                    }
                });
            }

        });
    });

    app.all('/setApplyStatus', function (req, res) {
        console.log(req.path);
        var rec_idx = req.body.idx;         // Article index
        var userKey = req.body.userKey;     // User key
        var status = req.body.status;
        
        connection.query('UPDATE RECRUIT_STATE SET status = ' + status + ' where rec_idx = ' + rec_idx + ' AND userKey = ' + userKey, function (err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    message: '변경 실패'
                });
            }
            else {
                res.json({
                    success: true,
                    message: '변경되었습니다'
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