const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', (req,res)=>{
    res.json('모든 책');
})

router.get('/:bookId', (req,res)=>{
    let bookId = parseInt(req.params.id);
    res.json('개별 책');
})

router.get('/:bookId&&:isNew', (req,res)=>{
    let bookId = parseInt(req.params.id);
    let isNew = req.params.isNew;
    res.json('개별 책');
})

module.exports = router;