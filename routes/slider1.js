const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require("../models/category");
const MainCategory = require("../models/mainCategory");
const Slider1 = require("../models/slider1");


router.get("/add-slider1",function(req,res){
    Category.find({},function(err,categories){   
      //  console.log(categories)
        res.render("admin/add-slider1",{
            categories:categories
        });
    })
});

router.post("/add-slider1", function(req,res){
   // var title= req.body.title;
   console.log(req.body)
   var id = req.body.id;
    var category =req.body.category;
    var slug = req.body.category.replace(/\s+/g, "-").toLowerCase();

    // Slider1.findOneAndUpdate({_id:})

     Slider1.findOne({_id:"5de53130ccfb083e30e1bab9"},function(err,slider1){
        
        console.log(slider1)
    //         // var slider1 = new Slider1({
    //         //     slug:slug,
    //         //     category:category
    //         // })
            if(req.body.category){
                slider1.category = req.body.category;
                slider1.slug = slider1.category.replace(/\s+/g, "-").toLowerCase();
            }

           // slider1.save();
            slider1.save(function(err){
                if(err){console.log(err)}
                // Slider1.find(function (err, slider1) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log(slider1);
                //     }
                // });
                else{
                res.redirect("/admin/categories");
                }
            })
        })
});

router.get("/",function(req,res){
    res.redirect("/admin/slider1/add-slider1");
});

module.exports = router;