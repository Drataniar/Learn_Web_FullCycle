const express = require('express'); //express
const router = express.Router();
const connection = require('../mariadb'); //db
const {StatusCodes} = require('http-status-codes'); //http-status-codes
const {body,param,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {join,login,passwordResetRequest,passwordReset} = require('../controller/UserController');


const validate = (req,res, next) => {
    const err = validationResult(req);

        if(err.isEmpty()){
            return next();
        }else{
            console.log(err.array());
            return res.status(StatusCodes.BAD_REQUEST).json(err.array());
            
        }
}

router.use(express.json());

router.post('/join', join)


router.post('/login', login)


router.post('/reset', passwordResetRequest)


router.put('/reset', passwordReset)

module.exports = router;