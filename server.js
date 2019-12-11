const express = require("express");
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require ("body-parser");
const session = require('express-session');
const fileUpload= require("express-fileupload");
var multer = require('multer');
//const {check, validationResult} = require('express-validator');
// var expressValidator = require('express-validator');

//connect to database
const uri = "mongodb://admin:aryan123@ds043168.mlab.com:43168/amarex-website";
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

app.use(fileUpload());

//Set global variable for error display in pages
app.locals.errors= null;

//Get Page model
var Category = require("./models/category");

Category.find({},function(err, categories){
    if(err){
        console.log(err)
    }else{
        app.locals.categories= categories;
    }
})


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
const products = require("./routes/products")
const adminpages= require("./routes/admin_pages.js");
const admincategories= require("./routes/admin_categories.js");
const adminproducts= require("./routes/admin_products.js");
const adminmaincategories = require("./routes/admin_mainCategories")
const admincatalogue = require("./routes/admin_catalogues")
const slider1 = require("./routes/slider1")
app.use("/admin/pages",adminpages);
app.use("/admin/categories",admincategories);
app.use("/admin/mainCategories",adminmaincategories);
app.use("/admin/products",adminproducts);
app.use("/products",products);
app.use("/admin/catalogues",admincatalogue);
app.use("/admin/slider1",slider1);
app.use("/",pages);

//Start server

var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("Server has started on port "+ port)
});