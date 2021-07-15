const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.get('/',function(req, res){
    res.render('index');
});

app.listen(8080);
console.log('Server started at 8080 for mywebsite...');