const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {check, validationResult} = require('express-validator');

//express
const myApp = express();
// db url
const dbUrl = 'mongodb://localhost:27017/foodshop';
const collection = 'order';

// view configuration
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');

// body parser
myApp.use(bodyParser.urlencoded({ extended:false}));

// connect to db
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

// all lists model
const Order = mongoose.model(collection,{
    name:String, 
    phone:String,
    sandwich:Number,
    fries:Number,
    soda:Number,
    subTotal:Number,
    tax:Number,
    totalCost:Number,
});

// regex
var phoneRegex = /^[0-9]{10}$/;

function checkRegex(userInput, regex){
    if(regex.test(userInput)){
        return true;
    }
    else{
        return false;
    }
}

function customPhoneValidation(value){
    if(!checkRegex(value, phoneRegex)){
        throw new Error('Phone should be in the format xxxxxxxxxx');
    }
    return true;
}


const validations = [
    check('name','Must have a name').not().isEmpty(),
    check('phone').custom(customPhoneValidation)

];

// orders get
myApp.get('/', (req, res)=>{
    res.render('orders',{errors:""});
});
// orders post
myApp.post('/',validations ,(req,res)=>{
    console.log(req.body);

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('orders',{
            errors:errors.array(),
        })
    }
    else{
        let {name, phone, sandwich, fries,soda} = req.body;
        let subTotal = 0,
            tax = 0
            totalCost = 0;

        console.log()
        if(isNaN(sandwich) || sandwich === ""){
            sandwich = 0;
        }
        if(isNaN(fries) || fries === ""){
            fries = 0;
        }
        if(isNaN(soda) || soda === ""){
            soda = 0;
        }

        subTotal = sandwich * 5.99 + fries * 1.99 + soda *1.49;
        subTotal = subTotal.toFixed(2);
        tax = subTotal * 0.13;
        tax = tax.toFixed(2);
        totalCost = parseFloat(subTotal) + parseFloat(tax) ;
        totalCost = totalCost.toFixed(2);
        
        const pageData = {name, phone, sandwich, fries, soda, subTotal,tax,totalCost};
        console.log(pageData);
        Order(pageData).save().then(()=>{
            console.log('New items stored');
        });
        res.render('thanks',pageData);
        
    }
})
// lists get
myApp.get('/lists',(req,res)=>{

    Order.find({}).exec((err,orders)=>{
        res.render('lists',{orders});
    })   

})


myApp.listen(8080);
console.log('Website at port 8080');