const express = require('express');
const router = express.Router();

router.use(express.json());

router.route('/')
.post( (req,res)=>{
    res.json('장바구니 담기');
})
.get((req,res)=>{
    res.json('장바구니 조회');
})

router.delete('/:id',(req,res)=>{
    res.json('장바구니 도서 삭제');
})

//
router.get('/:id',(req,res)=>{
    res.json('장바구니 도서 삭제');
})

module.exports = router;