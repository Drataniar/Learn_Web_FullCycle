const express = require('express');
const router = express.Router();
const connection = require('../mariadb');
const {body,param,validationResult} = require('express-validator');

router.use(express.json());

router.route('/')
.post([body('userId').notEmpty().isInt().withMessage('숫자를 입력하세요!'),
        body('channelName').notEmpty().isString().withMessage('문자 입력 필요!'),
        validate
]
    ,(req,res)=>{
        

    const { channelName, userId} = req.body;
    let sql = `INSERT INTO channels (name, user_id) VALUE(?,?)`;
        connection.query(sql,[channelName,userId],function (err, results) {
            if(err){
                return res.status(400).send();
            }
            res.status(201).json({
                message : `${channelName}채널을 생성하였습니다.`
            });
            }
          );
    
})
.get([body('userId').notEmpty().isInt().withMessage('숫자 입력 필요!'),
    validate
],
    (req,res)=>{

        const err = validationResult(req);

        if(!err.isEmpty()){
            console.log(err.array());
            return res.status(400).json(err.array());
        }

    var userId = req.body.userId;
    let sql = `SELECT * FROM channels WHERE user_id = ?`;

    connection.query(sql,userId,function (err, results) {
        if(err){
            return res.status(400).send();
        }

        if(results.length !== 0){
            res.status(201).json(results)
        }
        else{
            noChannelFound(res)
        }
        
    }
    )

        



        
})

router.route('/:id')
.get(param('id').notEmpty().isInt().withMessage('채널 id 필요!'),
    (req,res)=>{
        const err = validationResult(req);

        if(!err.isEmpty()){
            console.log(err.array());
            return res.status(400).json(err.array());
        }


    let param = parseInt(req.params.id);

    let sql = `SELECT * FROM channels WHERE id = ?`;
    connection.query(sql,param,function (err, results) {
        if(err){
            return res.status(400).send();
        }

        if(results.length !== 0){
            res.status(201).json(results)
        }
        else{
            noChannelFound(res)
        }
        
    }
    );
})
.put([param('id').notEmpty().isInt().withMessage('채널 id 필요!'),
    body('channelName').notEmpty().isString().withMessage('채널명 오류!')],
    (req,res)=>{
        const err = validationResult(req);

        if(!err.isEmpty()){
            console.log(err.array());
            return res.status(400).json(err.array());
        }

    let param = parseInt(req.params.id);
    let newChannelName = req.body.channelName;
    let previousChannelName  = "";
    let sql = `SELECT * FROM channels WHERE id = ?`;
    connection.query(sql,param,function (err, results) {
        if(err){
            return res.status(400).end();
        }
        //console.log(results.length !== 0);
        if(results.length !== 0){
            previousChannelName = results[0].name;
            let sql2 = `UPDATE channels SET name = ? WHERE id = ?`;
    connection.query(sql2,[newChannelName,param],function (err, results) {
        if(err){
            return res.status(400).end();
        }
        res.status(201).json({
            message : `${previousChannelName}채널이 ${newChannelName}으로 바뀌었습니다,`
        });

    }
    );
        }else{
            noChannelFound(res);
        }
            

        
    }
    );
    

})
.delete(param('id').notEmpty().isInt().withMessage('채널 id 필요!'),
    (req,res)=>{
        const err = validationResult(req);

        if(!err.isEmpty()){
            console.log(err.array());
            return res.status(400).json(err.array());
        }

    let param = parseInt(req.params.id);
    let sql = `SELECT * FROM channels WHERE id = ?`;
    connection.query(sql,param,function (err, results) {
        deletedUser = results[0];
        if(deletedUser)
            {
                let deleteSql = `DELETE FROM channels WHERE id = ?`;
                    connection.query(deleteSql,param,function (err, results) {
                            res.json({
                                message : `${deletedUser.name}님 다음에 안녕히가십시오`
                            })
                            }
                          );
            }
            else{
                noChannelFound(res)
            }
        
    });

})

function noChannelFound(res)
{
    res.status(404).json({
        message : "채널을 찾을 수 없습니다."
    })
}

const validate = (req,res) => {
    const err = validationResult(req);

        if(!err.isEmpty()){
            console.log(err.array());
            return res.status(400).json(err.array());
        }
}

    module.exports = router;

