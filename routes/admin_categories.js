const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require("../models/category");
const MainCategory = require("../models/mainCategory");

router.get("/",function(req,res){
    Category.find({},function(err,categories){
        if (err) console.log(err);

        res.render("admin/categories",{
            categories:categories
        });
    });
})

router.get("/add-category",function(req,res){
    var title = "";

    MainCategory.find(function(err,mainCategories){   

        res.render("admin/add-category",{
            title:title,
            mainCategories:mainCategories
        });
    })
});

router.post("/add-category", function(req,res){
    var title= req.body.title;
    var mainCategory =req.body.mainCategory;
    var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();

    Category.findOne({slug:slug},function(err,category){
        if(category){
            res.render("admin/add-category",{
                title:title,
                mainCategory:mainCategory
            });
        }else{
            var category = new Category({
                title:title,
                slug:slug,
                mainCategory:mainCategory
            })
            category.save(function(err){
                if(err){console.log(err)}
                Category.find(function (err, categories) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.app.locals.categories = categories;
                    }
                });
                res.redirect("/admin/categories");
            })
        }
    });
});

router.get("/edit-category/:slug",function(req,res){

    MainCategory.find(function(err,mainCategories){
        
        Category.findOne({slug:req.params.slug}, function(err,category){
            if(err){console.log(err)}
            else{
                res.render("admin/edit-category",{
                    title:category.title,
                    slug:category.slug,
                    id: category._id,
                    mainCategory: category.mainCategory.replace(/\s+/g, '-').toLowerCase(),
                    mainCategories:mainCategories
                })
            }
        })
    })
});


router.post("/edit-category/:slug",function(req,res){

    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
    var mainCategory =req.body.mainCategory;
    var id = req.body.id;

    Category.findOne({slug:slug,_id:{$ne:id}},function(err,category){
        if(category){
            res.render("admin/edit-category",{
                title:title,
                slug:slug,
                mainCategory:mainCategory
            })
        }else{
            Category.findById(id,function(err,category){
                if(err){console.log(err)}
                else{
                  //  console.log(category);
                    category.title=title,
                    category.slug=slug,
                    category.mainCategory=mainCategory

                    category.save(function(err){
                        if(err)console.log(err);
                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        })
                        res.redirect("/admin/categories")
                    })
                }
            })
        }
    })
});

router.get("/delete-category/:id",function(req,res){
    Category.findByIdAndRemove(req.params.id,function(err){
        if(err) console.log(err);

        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });
        
        res.redirect('/admin/categories');
    })
});

module.exports = router;