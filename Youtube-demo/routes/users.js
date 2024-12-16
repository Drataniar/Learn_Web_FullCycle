const express = require('express');
const router = express.Router()
const connection = require('../mariadb');
const {body,param,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const validate = (req,res, next) => {
    const err = validationResult(req);

        if(err.isEmpty()){
            return next();
        }else{
            console.log(err.array());
            return res.status(400).json(err.array());
            
        }
}

router.use(express.json())

router.post('/login',
    [body('userEmail').notEmpty().isEmail().withMessage('아이디를 확인해주세요'),
        body('password').notEmpty().isString().withMessage('비밀번호를 확인해주세요.'),
        validate],
    function(req,res,next){
    let loginInfo = req.body;
    let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql,loginInfo.userEmail,function (err, results) {
            if(err){
                return res.status(400).end();
            }

            
                const userInfo = results[0];
                if(userInfo && userInfo.password === loginInfo.password)
                    {
                        const token = jwt.sign({
                            userEmail : loginInfo.userEmail,
                            name : userInfo.name
                        },process.env.PRIVATE_KEY,{
                            expiresIn : '30m',
                            issuer : '1234'
                        });

                        res.cookie("token",token,{
                            httpOnly : true
                        });
                        console.log(token);
                        
                        res.status(201).json({
                            message : `${userInfo.name}님 환영합니다.`,
                            token : token
                        })
                    }
                    else {
                        res.status(403).json({
                            message : "아이디 혹은 비밀번호가 틀렸습니다"
                        });
                    }
            }
          );
    
})

router.post('/join',
    [body('email').notEmpty().isEmail().withMessage('아이디를 확인해주세요'),
    body('password').notEmpty().isString().withMessage('비밀번호를 확인해주세요.'),
    body('name').notEmpty().isString().withMessage("이름을 확인해 주세요"),
    body('contact').notEmpty().isString().withMessage("연락처를 확인해주세요"),
    validate],
    function(req,res,next){
    let userInfoInput = req.body;
    let userEmail = userInfoInput.email;
    const { name, password, contact} = req.body;
        let sql = `INSERT INTO users (email, name, password, contact) VALUE(?,?,?,?)`;
        let inputs = [userEmail, name, password, contact];
        connection.query(sql,inputs,function (err, results) {
            if(err){
                return res.status(400).end();
            }
            res.status(201).json({
                message : `${userInfoInput.name}님 환영합니다.`
            });

               
            }
          );
})

router.route('/users')
    .get(
        [body('email').notEmpty().isEmail().withMessage('아이디를 확인해주세요'),
            validate],
            function(req,res,next){
        let email = req.body.userEmail;

        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql,email,function (err, results) {
            if(err){
                return res.status(400).end();
            }


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
    .delete([body('email').notEmpty().isEmail().withMessage('아이디를 확인해주세요'),
        validate],
        function(req,res,next){
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
                                if(err){
                                    return res.status(400).end();
                                }

                                if(results.affectedRows ==0)
                                {
                                    return res.status(400).end();
                                }
                                else{
                                    res.status(200).json({
                                        message : `${deletedUser.name}님 다음에 안녕히가십시오`
                                    })
                                }
                                    
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