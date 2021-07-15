// import dependencies you will use
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//setting up Express Validator
const {check, validationResult} = require('express-validator'); // ES6 standard for destructuring an object

// set up variables to use packages
var myApp = express();
myApp.use(bodyParser.urlencoded({extended:false}));

// set path to public folders and view folders

myApp.set('views', path.join(__dirname, 'views'));
//use public folder for CSS etc.
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');
// set up different routes (pages) of the website

//home page
myApp.get('/', function(req, res){
    res.render('form'); // no need to add .ejs to the file name
});

//defining regular expressions
var phoneRegex = /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/;
var positiveNum = /^[1-9][0-9]*$/;
var postalCode = /^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/;  //Postal code
var customerId = /^[0-9]{4}\-[A-Z]{5}$/;             //CustomerId

//function to check a value using regular expression
function checkRegex(userInput, regex){
    if(regex.test(userInput)){
        return true;
    }
    else{
        return false;
    }
}
// Custom phone validation function
function customPhoneValidation(value){
    if(!checkRegex(value, phoneRegex)){
        throw new Error('Phone should be in the format xxx-xxx-xxxx');
    }
    return true;
}
// Valiation rules for tickets and lunch:
// 1. Tickets should be a number
// 2. User has to buy lunch if they buy less than 3 tickets
function customLunchAndTicketsValidation(value, {req}){
    var tickets = req.body.tickets;
    if(!checkRegex(tickets, positiveNum)){
        throw new Error('Please select tickets. Tickets should be a number');
    }
    else{
        tickets = parseInt(tickets);
        if(tickets < 3 && value != 'yes'){
            throw new Error('Lunch is required if you buy less than 3 tickets');
        }
    }
    return true;
}

// postcode
function customPostalCodeValidation(value){
    if(!checkRegex(value,postalCode)){
        throw new Error('Postal should be in the format X9X 9X9');
    }
    
    return true;
}

// customer Id
function customCustomerIdValidation(value){
    if(!checkRegex(value,customerId)){
        throw new Error('Customer Id should be in the format 9999-xxxxx');
    }
    
    return true;
}

myApp.post('/', [
    check('customerId').custom(customCustomerIdValidation),    //Customer Id
    check('name', 'Must have a name').not().isEmpty(),
    check('email', 'Must have email').isEmail(),
    check('phone').custom(customPhoneValidation),
    check('postcode').custom(customPostalCodeValidation),       //Postal Code
    check('lunch').custom(customLunchAndTicketsValidation)
],function(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        //console.log(errors); // check what is the structure of errors
        res.render('form', {
            errors:errors.array()
        });
    }
    else{
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var postcode = req.body.postcode;
        var tickets = req.body.tickets;
        var lunch = req.body.lunch;
        var campus = req.body.campus;

        var subTotal = tickets * 20;
        if(lunch == 'yes'){
            subTotal += 15;
        }
        var tax = subTotal * 0.13;
        var total = subTotal + tax;

        var pageData = {
            name : name,
            email : email,
            phone : phone, 
            postcode : postcode,
            lunch : lunch,
            tickets : tickets,
            campus : campus,
            subTotal : subTotal,
            tax : tax,
            total : total
        }
        res.render('form', pageData);
    }
});


//author page
myApp.get('/author',function(req,res){
    res.render('author',{
        name : 'Rohini Arora',
        studentNumber : '123123'
    }); 
});

// start the server and listen at a port
myApp.listen(8080);

//tell everything was ok
console.log('Everything executed fine.. website at port 8080....');


