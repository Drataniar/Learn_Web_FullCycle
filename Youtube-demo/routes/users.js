const express = require('express');
const router = express.Router()
const connection = require('../mariadb');

router.use(express.json())

router.post('/login',function(req,res){
    let loginInfo = req.body;
    
    if(loginInfo.userEmail && loginInfo.password)
    {   
        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql,loginInfo.userEmail,function (err, results) {
                const userInfo = results[0];
                if(userInfo && userInfo.password === loginInfo.password)
                    {
                            res.status(201).json({
                                message : `${userInfo.name}님 환영합니다.`
                            })
                    }
                    else {
                        res.status(400).json({
                            message : "아이디 혹은 비밀번호가 틀렸습니다"
                        });
                    }
            }
          );
    }
    else if(!loginInfo.userEmail){
        res.status(400).json({
            message : "아이디를 입력해 주십시요"
        });
    }
    else{
        res.status(400).json({
            message : "비밀번호를 입력해 주십시요"
        });
    }
})

router.post('/join',function(req,res){
    let userInfoInput = req.body;
    let userEmail = userInfoInput.email;
    if(userEmail)
    {
        const { name, password, contact} = req.body;
        let sql = `INSERT INTO users (email, name, password, contact) VALUE(?,?,?,?)`;
        let inputs = [userEmail, name, password, contact];
        connection.query(sql,inputs,function (err, results) {
                var userInfo = results[0];
                if(userInfo)
                    {
                        if(name && password)
                            {
                            
                                res.status(201).json({
                                    message : `${userInfo.name}님 환영합니다.`
                                });
                            }
                            else{
                                res.status(400).json({
                                    message : "회원정보를 제대로 입력해 주십시요"
                                });
                            }
                    }
                    else{
                        res.status(400).json({
                            message : "중복되는 아이디입니다. 다른 아이디로 입력해주세요"
                        });
                    }
            }
          );
        
    }
    else{
        res.status(400).json({
            message : "아이디를 입력해 주십시요"
        });
    }
})

router.route('/users')
    .get(function(req,res){
        let email = req.body.userEmail;

        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql,email,function (err, results) {
                if(results.length){
                    res.json(results);
                }
                else{
                    res.status(404).json({
                        message : "아이디에 해당하는 정보가 없습니다."
                    });
                }
            }
          );
    })
    .delete(function(req,res){
        let emailInput = req.body.userEmail;
        var deletedUser;
        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql,emailInput,function (err, results) {
                deletedUser = results[0];
                if(deletedUser)
                    {
                        const { email} = req.body;
                        let deleteSql = `DELETE FROM users WHERE email = ?`;
                            connection.query(deleteSql,email,function (err, results) {
                                    res.json({
                                        message : `${deletedUser.name}님 다음에 안녕히가십시오`
                                    })
                                    }
                                  );
                    }
                    else{
                        res.status(404).json({
                            message : "회원 정보를 찾을 수 없습니다."
                        })
                    }
                
            });
    })



    module.exports = router;