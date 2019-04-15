const express = require('express')
const mongoose = require('mongoose')
const {Product, addItem} = require('../models/product')
const router = express.Router()

mongoose.connect('mongodb://localhost/csc_version1',{ useNewUrlParser: true })
    .then(() => console.log('connected to DB..'))
    .catch(err => console.log('some error',err));


router.get('/',(req,res) => {
    res.send('hello')
})

router.get('/list',async (req,res) => {
    const products = await Product.find({}).select({description : 1});
    // console.log(products)
    res.send(products)
})
router.get('/list/:product',async (req,res) => {
    const prod_details = await Product.find({description: req.params.product})
    console.log(prod_details)
    res.send(prod_details)
})

router.post('/add',async (req,res) => {
    console.log(req.body)
    let {description,type,piece_rate,qty_per_unit} = req.body
    let result = await addItem({
        description: description,
        type: type,
        piece_rate: parseFloat(piece_rate),
        qty_per_unit: parseInt(qty_per_unit)
    })
    console.log(result)
    req.session.link = 'add';
    req.flash('success', 'Product '+result.description+ ' added successfully');
    res.redirect('/welcome')    
})


module.exports = router