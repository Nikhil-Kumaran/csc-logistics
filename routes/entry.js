const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')

const router = express.Router()


mongoose.connect('mongodb://localhost/csc_version1',{ useNewUrlParser: true })
    .then(() => console.log('connected to DB..'))
    .catch(err => console.log('some error',err));

var Schema = mongoose.Schema;

// create a schema
let userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true},
    hello: String
})

// we need to create a model using it
var User = mongoose.model('User', userSchema);


router.get('/',(req,res) => {
    res.send("entry success")
})

router.get('/login',(req,res) => {
    console.log(req.flash)
    let m = req.flash()
    console.log(m)
    console.log(req.flash())
    console.log(req.session)
    res.render('entry/login',message=m)
})

router.post('/login',async (req,res) => {
    const user = await User.findOne({username: req.body.username, password: req.body.password});
    if(!user){
        req.flash('danger', 'user not registered');
        res.redirect('/entry/login')
    }
    else{
        let sess
        sess = req.session
        sess.user = req.body.username
        sess.role = user.role
        console.log('hello')
        res.redirect('/welcome');
    }
})

router.get('/logout', (req,res) => {
    req.session.destroy((err) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
    });
})



module.exports = router