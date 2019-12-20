const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require("../models/category");
const MainCategory = require("../models/mainCategory");
const Slider3 = require("../models/slider3");


router.get("/add-slider3",function(req,res){
    Category.find({},function(err,categories){   
      //  console.log(categories)
        res.render("admin/add-slider3",{
            categories:categories
        });
    })
});

router.post("/add-slider3", function(req,res){
    var id = req.body.id;
    var category =req.body.category;
    var slug = req.body.category.replace(/\s+/g, "-").toLowerCase();

    Slider3.findOne({_id:"5dfd23537f93171cd04e7289"},function(err,slider3){
        
        if(req.body.category){
            slider3.category = req.body.category;
            slider3.slug = slider2.category.replace(/\s+/g, "-").toLowerCase();
        }

        slider3.save(function(err){
            if(err){console.log(err)}
            else{
            res.redirect("/admin/categories");
            }
        })
    })
 });

router.get("/",function(req,res){
    res.redirect("/admin/slider3/add-slider3");
});

module.exports = router;