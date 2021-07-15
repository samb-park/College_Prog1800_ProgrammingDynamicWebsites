const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const app = express();
 
mongoose.connect('mongodb://localhost:27017/spstore',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const Order = mongoose.model('order',{
    name:String,
    email:String,
    phone:String,
    address:String,
    city:String,
    postcode:String,
    province:String,
    product1:Number,
    product2:Number,
    product3:Number,
    shippingCharge:Number,
    subTotal:Number,
    tax:Number,
    taxTotal:Number,
    total:Number});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.get('/',function(req, res){
    res.render('order');
});

const phoneRegex = /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/;
const postalCode = /^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/;  //Postal code

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
        throw new Error('Phone should be in the format xxx-xxx-xxxx');
    }
    return true;
}

function customPostalCodeValidation(value){
    if(!checkRegex(value,postalCode)){
        throw new Error('Postal should be in the format X9X 9X9');
    }
    
    return true;
}

const validator = [
    check('name','Must have a name').not().isEmpty(),
    check('email','Must have a email').isEmail(),
    check('phone').custom(customPhoneValidation),
    check('address','Must have a address').not().isEmpty(),
    check('city','Must have a city').not().isEmpty(),
    check('postcode').custom(customPostalCodeValidation)
];

app.post('/',validator,function(req, res){
    let {name,email,phone,address,city,postcode,province,product1,product2,product3,deliveryTime} = req.body;
    let subTotal = 0;
    let total = 0;
    let shippingCharge = 0;
    let tax = 0;
    let taxTotal = 0;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('order',{
            errors:errors.array()
        })
    }
    else{
        product1 = product1===""?0:parseInt(product1) * 10;
        product2 = product2===""?0:parseInt(product2) * 10;
        product3 = product3===""?0:parseInt(product3) * 10;
    
        shippingCharge = (product3 + product2 + product1 )===0?0:parseInt(deliveryTime);
        subTotal = product1 + product2 + product3 + shippingCharge;
        tax = (parseFloat(province.split(',')[1]) + 0.05);
        taxTotal = (subTotal * tax);
        total = (taxTotal + subTotal);
        taxTotal = taxTotal.toFixed(2);
        total = total.toFixed(2)
        tax = tax *100;
    
        province = province.split(',')[0];
    
        const orderInformation = {name,email,phone,address,city,postcode,province,product1,product2,product3,deliveryTime,shippingCharge,subTotal,tax,taxTotal,total};
        const orderList = new Order(orderInformation);

        res.render('invoice',orderInformation);
        orderList.save().then(()=>{
            console.log('New order information stored');
        })
    }


});

app.get('/lists',(req,res)=>{
    Order.find({}).exec((err,orders)=>{
        res.render('lists',{orders});
    })
})

app.listen(8080);
console.log('Server started at 8080 for mywebsite...');