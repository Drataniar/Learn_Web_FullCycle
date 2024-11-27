const express = require('express')
const app = express();
app.listen(3000);


const fruits = [
    {id : 1, name : "mango"},
    {id : 2, name : "banana"},
    {id : 3, name : "pear"},
    {id : 4, name : "peach"}
]

app.get('/fruits',function(req,res){
    res.json(fruits);
})

app.get('/fruits/:id',function(req,res){
    let param = parseInt(req.params.id);

    var findFruitById = fruits.find(fruit =>(fruit.id == param));
    //fruit은 fruits 안의 한 개의 객체를 나타낸다. 

    /*
    fruits.forEach(function(fruit){
        if(fruit.id == param){
            findFruitById = fruit;
        }
    })
    */
    //res.json(fruits[param-1]);

    if(findFruitById)
    {
        res.json(findFruitById);
    }
    else{
        res.status(404).send(
            "해당 id에 과일이 존재하지 않습니다."
        );
        //404 http 코드를 전달하고 해당 텍스트를 출력
    }
})
