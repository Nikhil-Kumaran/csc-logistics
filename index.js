const express = require('express')
const path = require('path')
const entry = require('./routes/entry')
const dashboard = require('./routes/dashboard')
const products = require('./routes/products')
const orders = require('./routes/orders')
const session = require('express-session');
// const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const app = express()

app.set('view engine','pug')
app.set('views',path.join(__dirname, 'views'))

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(express.json())
app.use(express.urlencoded( {extended : true } ))

app.use(cookieParser('keyboard cat'));

app.use(session({secret: 'ssshhhhh',resave: true, saveUninitialized: true, maxAge  : new Date(Date.now() + 360000000000), expires : new Date(Date.now() + 3600000000), cookie: { maxAge: 600000000 }}));
app.use(flash());
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// Express Validator Middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root    = namespace.shift()
//         , formParam = root;
  
//       while(namespace.length) {
//         formParam += '[' + namespace.shift() + ']';
//       }
//       return {
//         param : formParam,
//         msg   : msg,
//         value : value
//       };
//     }
// }));

app.use('/entry',entry)
app.use('/welcome',dashboard)
app.use('/products',products)
app.use('/orders',orders)

app.get('/',(req,res) => {
    res.render('index', {title:'Home Page'})
})
app.get('/about',(req,res) => {
    res.render('about', {title:'About Page'})
})



const PORT = process.env.PORT || 3005
app.listen(PORT, () => console.log('listening to port '+PORT))