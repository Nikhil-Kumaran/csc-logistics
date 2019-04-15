const express = require('express')
const _ = require('lodash')
const router = express.Router()

router.get('/',(req,res) => {
    if(req.session.user){
        let m = req.flash()
        console.log(m)
        if(req.session.role == 'ho' && _.isEmpty(m)){
            res.render('dashboard/ho',{user:req.session.user,link: 'default'})
        }
        else if(req.session.role == 'ho' && !_.isEmpty(m)){
            res.render('dashboard/ho',{user:req.session.user, link:req.session.link, message:m})
        }
        else if(req.session.role == 'godown'){
            res.render('dashboard/godown',{user:req.session.user,link: 'default'})
        }
        else if(req.session.role == 'press'){
            res.render('dashboard/press',{user:req.session.user,link: 'default'})
        }
    }
    else{
        res.redirect('/')
    }
})

module.exports = router