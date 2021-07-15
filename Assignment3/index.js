const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.get('/',function(req, res){
    res.render('index',{errors : ''});
});

const validation = [
    check('username','Must enter a username.').not().isEmpty(),
    check('address','Must enter an address.').not().isEmpty(),
    check('city','Must enter a city.').not().isEmpty(),
    check('province','Must select a province.').not().isEmpty(),
    check('email','Email is invalid or empty').isEmail(),
    check('phone','Phone is invalid or empty ').isMobilePhone()
];

app.post('/',validation,(req, res)=>{
    const errors = validationResult(req).array();
    const {html,css,javascript,nodejs,username,address,city,phone,province,email} = req.body;
    let items = new Array();
    
    if(html !== undefined)
    {
        items.push("html");
    }

    if(css !== undefined)
    {
        items.push("css");
    }

    if(javascript !== undefined)
    {
        items.push("javascript");
    }

    if(nodejs !== undefined)
    {
        items.push("nodejs");
    }
    
    if(items.length === 0){
        errors.push({msg:'Must select one of item'});
    }
    else if( items.length === 1)
    {
        errors.push({msg:'Minimum purchase should be of $10'});
    }

    console.log(req.body);
    if(errors.length !== 0){
        res.render('index',{errors});
    }
    else{
        const itemList = items.join(", ");
        let price = 0;

        if(province === "YT" || province === "NT" || province === "AB" || province === "NU")
        {
            price = items.length * 5 * (0 + 0.05 + 1);
        }
        else if(province === "SK")
        {
            price = items.length * 5 * (0.06 + 0.05 + 1);
        }
        else if(province === "BC" || province === "MB")
        {
            price = items.length * 5 * (0.07 + 0.05 + 1);
        }        
        else if(province === "ON")
        {
            price = items.length * 5 * (0.08 + 0.05 + 1);
        }
        else if(province === "QC")
        {
            price = items.length * 5 * (0.09975 + 0.05 + 1);
        }
        if(province === "NB" || province === "NL" || province === "AS" || province === "PE")
        {
            price = items.length * 5 * (0.1 + 0.05 + 1);
        }


        res.render('receipt',{username,address,city,phone,province,email,itemList,price});
    }
    
})

app.listen(8080);
console.log('Server started at 8080 for mywebsite...');