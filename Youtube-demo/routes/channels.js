const express = require('express');
const router = express.Router();
const connection = require('../mariadb');
router.use(express.json());

router.route('/')
.post((req,res)=>{
    const { channelName, userId} = req.body;
    if(channelName && userId){
        let sql = `INSERT INTO channels (name, user_id) VALUE(?,?)`;
        connection.query(sql,[channelName,userId],function (err, results) {
            res.status(201).json({
                message : `${channelName}채널을 생성하였습니다.`
            });
            }
          );
    }else{
        res.status(400).json({
            message : "채널 이름과 아이디을 제대로 입력해주세요!"
        })
    }
    
})
.get((req,res)=>{
    var userId = req.body.userId;
    let sql = `SELECT * FROM channels WHERE user_id = ?`;
    if(userId){
        connection.query(sql,userId,function (err, results) {
            if(results.length !== 0){
                res.status(201).json(results)
            }
            else{
                noChannelFound(res)
            }
            
        }
        )
    }else{
        res.status(400).end();
    }

        



        
})

router.route('/:id')
.get((req,res)=>{
    let param = parseInt(req.params.id);

    let sql = `SELECT * FROM channels WHERE id = ?`;
    connection.query(sql,param,function (err, results) {
        if(results.length !== 0){
            res.status(201).json(results)
        }
        else{
            noChannelFound(res)
        }
        
    }
    );
})
.put((req,res)=>{
    let param = parseInt(req.params.id);
    let newChannelName = req.body.channelName;
    let previousChannelName  = "";
    let sql = `SELECT * FROM channels WHERE id = ?`;
    connection.query(sql,param,function (err, results) {
        if(results){
           previousChannelName = results[0].name;
        }
        else{
            noChannelFound(res)
        }
        
    }
    );
    let sql2 = `UPDATE channels SET name = ? WHERE id = ?`;
    connection.query(sql2,[newChannelName,param],function (err, results) {
        if(results){
            res.status(201).json({
                message : `${previousChannelName}채널이 ${newChannelName}으로 바뀌었습니다,`
            });
        }
        else{
            noChannelFound(res)
        }
        
    }
    );

})
.delete((req,res)=>{
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

    module.exports = router;

