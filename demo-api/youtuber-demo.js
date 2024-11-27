const express = require('express')
const app = express()

//
let db = new Map();

 //https://www.youtube.com/@Arknights_KR_Official
    let youtuber1 = {
    channelTitle:"명일방주",
    sub: "3.76만명",
    videoNum : "638개"
}

//https://www.youtube.com/@Team_Keo
let youtuber2 = {
    channelTitle:"팀 케오",
    sub: "1.09만명",
    videoNum : "304개"
}

//https://www.youtube.com/@LCK
let youtuber3 = {
    channelTitle:"LCK",
    sub: "143만명",
    videoNum : "1만개"
}

db.set(1, youtuber1)
db.set(2, youtuber2)
db.set(3, youtuber3)

    app.get('/youtubers',function(req,res){
        let temp={};
        db.forEach(function(dbJson,index){
            temp[index]=dbJson
        })
        res.json(temp)
    })

    app.get('/youtubers/:id', function (req, res) {
        let param = parseInt(req.params.id);
        const youtuber = db.get(param)
        if(youtuber ==undefined)
        {
            res.json({
                message : "유튜버 정보를 찾을 수 없습니다."
            })
        }
        else{
            res.json(youtuber);
        }
        
    })

    app.use(express.json())

    app.post('/youtubers',function(req,res){

    let postYoutuber = req.body;
        db.set(db.size+1,postYoutuber)
        console.log(req.body);
        res.json({
            message : `${req.body.channelTitle}님, 유튜버 생활을 응원합니다.`

        })
    })
    

    app.delete('/youtubers/:id',function(req,res){
        let param =parseInt(req.params.id)
        const youtuber = db.get(param)
        if(youtuber ==undefined)
        {
            res.json({
                message : "유튜버 정보를 찾을 수 없습니다."
            })
        }
        else{
            const name = db.get(param).channelTitle
            db.delete(param)
            res.json({
                message : `${name}님이 DB에서 삭제되었습니다.`
            })
        }
        
    })

    app.delete('/youtubers',function(req,res){

        if(db.size ===  0)
        {
            res.json({
                message : "유튜버 정보를 찾을 수 없습니다. 삭제 할 수 없습니다."
            })
        }
        else{
            let temp ={}
            let temptext = ""
            db.forEach(function(dbJson,index){
                temptext += `${dbJson.channelTitle}님이 DB에서 삭제되었습니다.\n`
                db.delete(index)
            
            })
            temp.text = temptext;
            res.json(temp)
        }
        
        
    })

    app.put('/youtubers/:id',function(req,res){

        let param =parseInt(req.params.id)
        const youtuber = db.get(param)
        if(youtuber ==undefined)
        {
            res.json({
                message : "유튜버 정보를 찾을 수 없습니다."
            })
        }
        else{
            let previousName = youtuber.channelTitle;
            let newName = req.body.channelTitle;
            youtuber.channelTitle = newName;
            db.set(param,youtuber);
            console.log(newName);

            res.json({
                message : `${previousName}님이 ${newName}으로 수정되었습니다.`
            })
        }

        
    })

app.listen(3000)