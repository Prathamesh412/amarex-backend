const express = require("express");
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require ("body-parser");
const session = require('express-session');
const fileUpload= require("express-fileupload")
//const {check, validationResult} = require('express-validator');
// var expressValidator = require('express-validator');

//connect to database
const uri = "mongodb://amarexadmin:Amarex%401234@ds241097.mlab.com:41097/amarex-backend-db";
const db = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true},function(err){
    if (err) console.log(err)
    console.log("Mongolab database connected")
});

//initialize app
const app = express();

//View Engine setup
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

//Set public folder
app.use(express.static(path.join(__dirname,"public")));

//Set global variable for error display in pages
app.locals.errors= null;

// Expree file upload middleware
app.use(fileUpload());

//Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Express Sessions Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  mongoose.set('useFindAndModify', false);

//set Routes
const pages= require("./routes/pages");
const adminpages= require("./routes/admin_pages.js");
const admincategories= require("./routes/admin_categories.js");
const adminproducts= require("./routes/admin_products.js");
app.use("/admin/pages",adminpages);
app.use("/admin/categories",admincategories);
app.use("/admin/products",adminproducts);
app.use("/",pages);

//Start server
var port = 3000;
app.listen(port,function(){
    console.log("Server has started on port "+ port)
})