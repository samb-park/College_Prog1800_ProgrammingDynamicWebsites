
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator'); 
const mongoose = require('mongoose');

var myApp = express();
myApp.use(bodyParser.urlencoded({extended:false}));

myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/college',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const Record = mongoose.model('Record',{
    studentId : Number,
    name:String,
    email:String,
    course:String
})

myApp.get('/', function(req, res){
    res.render('form'); 
});

myApp.post('/', [
    check('studentId','Must have a student ID').not().isEmpty(), 
    check('name', 'Must have a name').not().isEmpty(),
    check('email', 'Must have email').isEmail(),
    check('course','Must select a course').not().isEmpty()
],function(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.render('form', {
            errors:errors.array()
        });
    }
    else{
        const {studentId, name, email, course} = req.body;
        const pageData = {studentId, name, email, course}

        res.render('form', pageData);

        const record = new Record(pageData);

        record.save().then(()=>{
            console.log("Student data stored");
        })
    }
});

// all student information
myApp.get('/records',function(req,res){
    Record.find({}).exec((err,records)=>{
        res.render('records',{records});
        console.log(records);
    })
});

// start the server and listen at a port
myApp.listen(8080);

//tell everything was ok
console.log('Everything executed fine.. website at port 8080....');


