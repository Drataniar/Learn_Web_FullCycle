const express = require('express');
const app = express();
app.listen(3000);

var db = new Map();

app.use(express.json())

app.post('/login',function(req,res){
    let loginInfo = req.body;

    if(loginInfo.id && loginInfo.password)
    {   
        let userInfo = db.get(loginInfo.id);

        if(userInfo)
        {
            if(userInfo.password === loginInfo.password)
            {
                let userName = db.get(loginInfo.id).name;

                res.status(201).json({
                    message : `${userName}님 환영합니다.`
                })
            }
            else{
                res.status(400).json({
                    message : "아이디와 비밀번호를 제대로 입력해 주십시요"
                });
            }
        }
        else{
            res.status(400).json({
                message : "아이디와 비밀번호를 제대로 입력해 주십시요"
            });
        }
        
    }
    else{
        res.status(400).json({
            message : "아이디와 비밀번호를 제대로 입력해 주십시요"
        });
    }
})

app.post('/join',function(req,res){
    let loginInfo = req.body;
    //console.log(loginInfo);
    //console.log(loginInfo.id);
    let userId = loginInfo.id;
    if(userId)
    {
        if(!db.get(userId))
        {
            if(loginInfo.name && loginInfo.password)
                {
                    db.set(loginInfo.id,loginInfo);
            
                    res.json({
                            message : `${db.get(loginInfo.id).name}님 환영합니다.`
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
    else{
        res.status(400).json({
            message : "아이디를 입력해 주십시요"
        });
    }
    
    
})

app.route('/users/:id')
    .get(function(req,res){
        let id = req.params.id;
        let userInfo = db.get(id);
        if(userInfo)
        {
            res.json({
                id : userInfo.id,
                name : userInfo.name
            });
        }
        else{
            res.status(404).json({
                message : "아이디에 해당하는 정보가 없습니다."
            });
        }
        
    })
    .delete(function(req,res){
        let id = req.params.id;
        let deletedUser = db.get(id);

        if(deletedUser)
        {
            db.delete(id);
            res.json({
                message : `${deletedUser.name}님 다음에 안녕히가십시오`
            })
        }
        else{
            res.status(404).json({
                message : "회원 정보를 찾을 수 없습니다."
            })
        }
        
    })