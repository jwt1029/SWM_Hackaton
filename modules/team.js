var mysql = require('mysql');

module.exports = {
    'init' : function(app, connection){
        init(app, connection);
    }
}

function init(app, connection){
    app.all('/createTeam', function (req, res) {
        console.log(req.path);

        var rec_idx = req.body.rec_idx;
        var master = req.body.master; 

        connection.query('INSERT INTO TEAM (master) VALUE (' + master + ')', function (err, rows) {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    message: '팀 생성 오류'
                });
            }
            else {
                connection.query('SELECT userKey, position FROM RECRUIT_STATE WHERE rec_idx = ' + rec_idx + ' AND status = 1', function (err, users) {
                    if (err) {
                        console.log(err);
                        res.json({
                            success: false,
                            message: '합격자 정보 조회 오류'
                        });
                    }
                    else {
                        var values = [];
                        getLastInsertId(function(team_idx) {
                            for(var k in users) {
                                values.push([team_idx, users[k].userKey, users[k].position]);
                            }

                            connection.query('INSERT INTO TEAM_MEMBERS (team_idx, userKey, position) VALUES ?', [values], function (err, rows) {
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        success: false,
                                        message: '멤버 추가 오류'
                                    });
                                }
                                else {
                                    res.json({
                                        success: true,
                                        message: '팀 생성 완료'
                                    });
                                }
                            });

                        });
                    }
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