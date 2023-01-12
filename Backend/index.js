var express = require ('express');
var connection = require ('./database');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// import route
const employeeRoute = require('./routes/employee');
const departmentRoute = require('./routes/department');
const rankRoute = require('./routes/rank');

//middle ware
app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Route Middleware
app.use("/api/employee", employeeRoute);
app.use("/api/department", departmentRoute);
app.use("/api/rank", rankRoute);
app.use('/Image', express.static('upload/images'));


app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
    connection.connect((err)=>{
        if(err) throw err;
        console.log('Database Connection Successed');
    })
})