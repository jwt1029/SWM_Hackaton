var mysql = require('mysql');

module.exports = {
    'init' : function(app, connection){
        init(app, connection);
    }
}

function init(app, connection){
    app.all('/register', function (req, res) {
        console.log(req.path);

        var id = req.body.id;       // User ID
        var pw = req.body.password; // User PW
        var pw_again = req.body.password_again; // User PW Again
        var name = req.body.name;   // User Name

        console.log('id',id);
        if(pw != undefined && pw == pw_again) {

            connection.query('SELECT COUNT(*) as count FROM ACCOUNT WHERE userID = ' + mysql.escape(id), function (err, rows) {
                if (err) {
                    throw err;
                }

                console.log(rows);

                res.json(rows);
            });
            // var exist; // = 'SELECT COUNT(*) FROM ACCOUNT WHERE userID = ' + escape(id);
            // if(exist > 0) {
            //     // INSERT INTO ACCOUNT (userID, userPW, userName) VALUES (' + escape(id) + ',' + escape(pw) + ',' + escape(name) + ');'
            //     var userKey = getUserKey(id, pw);
            //     res.json({
            //         success: true,
            //         message: '환영합니다 ' + name,
            //         userKey: userKey
            //     });
            // }
            // else {
            //     res.json({
            //         success: false,
            //         message: '이미 존재하는 아이디입니다.'
            //     });
            // }
            
            // connection.query("INSERT INTO ACCOUNT (userName, userID, userPW) values ('TESTER1', 'test1', 'test1');", function (err, rows) {
            //     if (err) {
            //         throw err;
            //     }
            // });

        }
        else if(pw != pw_again){
            res.json({
                success: false,
                message: '재입력한 패스워드가 일치하지 않습니다.'
            });
        }
        else {
            res.json({
                success: false,
                message: '알수 없는 오류. 다시 시도해주세요.'
            });
        }
    });

    app.all('/login', function (req, res) {
        console.log(req.path);
        var id = req.body.id;       // User ID
        var pw = req.body.password; // User PW
        
        var accountCount; // = SELECT COUNT(*) FROM ACCOUNT WHERE userID = ' + escape(id) + ', userPW = ' + escape(pw); 
        if(accountCount > 0) {
            var userKey = getUserKey(id, pw);
            res.json({
                success: false,
                message: null,
                userKey: userKey
            });
        }
        else {
            res.json({
                success: false,
                message: '아이디 또는 비밀번호를 확인해주세요.'
            });
        }
    });

    function getUserKey(id, pw) {
        // return SELECT userKey FROM ACCOUNT WHERE userID = ' + escape(id) + ', userPW = ' + escape(pw);
    }

}