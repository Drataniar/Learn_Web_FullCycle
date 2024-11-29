const express = require('express');
const router = express.Router();


var db = new Map();
var channelId = 1;

router.use(express.json());

router.route('/')
.post((req,res)=>{
    if(req.body.channelName && req.body.userId){
        db.set(channelId++,req.body);
        res.status(201).json({
            message : `${db.get(channelId-1).channelName}채널을 생성했습니다.`
        });
    }else{
        res.status(400).json({
            message : "채널 이름과 아이디을 제대로 입력해주세요!"
        })
    }
    
})
.get((req,res)=>{
    var channelTemp=[];
    var userId = req.body.userId;
    var isThereUserIdInDB = false;
        if(db.size !== 0 && userId){
            db.forEach(function(dbJson, index){
                if(dbJson.userId === userId)
                {
                    channelTemp.push(dbJson);
                    isThereUserIdInDB=true;
                }
            });

            if(isThereUserIdInDB){
                res.status(200).json(channelTemp)
            }
            else{
                res.status(404).json({
                    message : "로그인이 필요한 페이지입니다"
                })
            }
        }else if(db.size === 0 && userId){
            res.status(404).json({
                message : "채널이 없습니다."
            })
        }
        else{
            res.status(404).json({
                message : "로그인이 필요한 페이지입니다"
            })
        }
})

router.route('/:id')
.get((req,res)=>{
    let param = parseInt(req.params.id);
    let channel = db.get(param);
    if(channel){
        res.status(200).json(channel);
    }
    else{
        noChannelFound()
    }
})
.put((req,res)=>{
    let param = parseInt(req.params.id);
    let previousChannelName = db.get(param).channelName;
    let channel = db.get(param);
    let newChannelName = req.body.channelName;
    if(channel){
        if(newChannelName)
        {
            channel.channelName = newChannelName;
            db.set(param,channel);

            res.status(201).json({
                message : `${previousChannelName}채널이 ${newChannelName}으로 바뀌었습니다,`
            });
        }
        else{
            res.status(400).json({
                message : `바꿀 채널 이름을 넣어주세요`
            });
        }
    }
    else{
        noChannelFound()
    }
})
.delete((req,res)=>{
    let param = parseInt(req.params.id);
    let channel = db.get(param);
    if(channel){
        db.delete(param);
        res.status(200).json({
            message : `${channel.channelName}채널이 삭제되었습니다.`
        });
    }
    else{
        noChannelFound()
    }
})

function noChannelFound()
{
    res.status(404).json({
        message : "채널을 찾을 수 없습니다."
    })
}

    module.exports = router;

