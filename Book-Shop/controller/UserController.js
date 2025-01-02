const connection = require('../mariadb'); //db
const {StatusCodes} = require('http-status-codes'); //http-status-codes
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); //암호화
const dotenv = require('dotenv');
dotenv.config();

const join = (req,res)=>{
    const { userEmail, password} = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    //회원 가입 시 비밀 번화 암호화 후 slat 값을 같이 저장
        let sql = `INSERT INTO users (email, password, salt) VALUE(?,?,?)`;
        let inputs = [userEmail, hashPassword,salt];
        connection.query(sql,inputs,function (err, results) {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            res.status(StatusCodes.CREATED).json({
                message : `${userEmail}님 환영합니다.`
            });

               
            }
          );

}

const login = (req,res)=>{
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword; 

    let sql = `SELECT * FROM users WHERE email = ?`;
    connection.query(sql,userEmail, (err, results) => {
        if(err){
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const loginUser = results[0];

        const hashPassword = crypto.pbkdf2Sync(userPassword, loginUser.salt, 10000, 10, 'sha512').toString('base64');;


        if(loginUser && loginUser.password == hashPassword){
            const token = jwt.sign({
                userEmail : loginUser.email
            }, process.env.PRIVATE_KEY, {
                expiresIn : '5m',
                issuer : 'book-shop',
            });


            res.cookie("token",token,{
                httpOnly : true
            })
            return res.status(StatusCodes.OK).json(results);
        }
        else{
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
});
}

const passwordResetRequest = (req,res)=>{
    const userEmail = req.body.userEmail;

    let sql = `SELECT * FROM users WHERE email = ?`;

    connection.query(sql,userEmail, (err, results) => {
        if(err){
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const requestUser = results[0];

        if(requestUser){
            return res.status(StatusCodes.OK).json({
                userEmail : requestUser.email
            });
        }
        else{
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
});
}

const passwordReset = (req,res)=>{
    const userEmail = req.body.userEmail;
    const newPassword = req.body.newPassword;


    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(newPassword, salt, 10000, 10, 'sha512').toString('base64');
    const inputs = [hashPassword,salt,userEmail]; 
    let sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
    connection.query(sql,inputs,function (err, results) {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.affectedRows === 0){
            console.log(results);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        else{
            return res.status(StatusCodes.OK).json(results);
        }

        
    }
    );
}

module.exports = {join, login, passwordResetRequest, passwordReset};