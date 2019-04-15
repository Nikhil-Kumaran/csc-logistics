const express = require('express')
const _ = require('lodash')
const {Order, placeOrder} = require('../models/order')
const {Product} = require('../models/product')
const router = express.Router()



router.get('/',(req,res) => {
    res.send('hello')
})

router.post('/new',async (req,res) => {
    let order = JSON.parse(req.body.order).order
    if(_.isEmpty(order)){
        req.flash('danger', 'Error in placing the order');
    }
    else{
        let result = await placeOrder({
            user: req.session.user,
            order: order
        })
        console.log(result)
        req.flash('success', 'Order placed successfully');
    }
    req.session.link = 'order';
    res.redirect('/welcome')    
})

router.get('/all',async (req,res) => {
    const orders = await Order.find({})
    res.send(orders)
})

module.exports = router