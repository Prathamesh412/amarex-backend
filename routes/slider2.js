const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require("../models/category");
const MainCategory = require("../models/mainCategory");
const Slider2 = require("../models/slider2");


router.get("/add-slider2",function(req,res){
    Category.find({},function(err,categories){   
      //  console.log(categories)
        res.render("admin/add-slider2",{
            categories:categories
        });
    })
});

router.post("/add-slider2", function(req,res){
   
    var id = req.body.id;
    var category =req.body.category;
    var slug = req.body.category.replace(/\s+/g, "-").toLowerCase();

    Slider2.findOne({_id:"5dfd202729eeb40240e92d2c"},function(err,slider2){

        if(req.body.category){
            slider2.category = req.body.category;
            slider2.slug = slider2.category.replace(/\s+/g, "-").toLowerCase();
        }

        slider2.save(function(err){
            if(err){console.log(err)}
            else{
            res.redirect("/admin/categories");
            }
        })
    })
});

router.get("/",function(req,res){
    res.redirect("/admin/slider2/add-slider2");
});

module.exports = router;