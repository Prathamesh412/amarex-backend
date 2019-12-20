const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require("../models/category");
const MainCategory = require("../models/mainCategory");
const Slider4 = require("../models/slider4");


router.get("/add-slider4",function(req,res){
    Category.find({},function(err,categories){   
      //  console.log(categories)
        res.render("admin/add-slider4",{
            categories:categories
        });
    })
});

router.post("/add-slider4", function(req,res){

    console.log(req.body)
    var id = req.body.id;
     var category =req.body.category;
     var slug = req.body.category.replace(/\s+/g, "-").toLowerCase();
      
    Slider4.find({},function(err,slider4){
        if(req.body.category){
            slider4.category = req.body.category;
            slider4.slug = slider4.category.replace(/\s+/g, "-").toLowerCase();
        }
            
        var slider4 = new Slider4({
            slug:slug,
            category:category
        })

        slider4.save(function(err){
            if(err){console.log(err)}       
            else{
            res.redirect("/admin/categories");
            }
        })
    })
 });

router.get("/",function(req,res){
    res.redirect("/admin/slider4/add-slider4");
});

module.exports = router;