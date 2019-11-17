const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const MainCategory = require("../models/mainCategory");

router.get("/",function(req,res){
    MainCategory.find({},function(err,maincategories){
        if (err) console.log(err);

        res.render("admin/mainCategories",{
            maincategories:maincategories
        });
    });
})

router.get("/add-mainCategory",function(req,res){
    var title = "";

    res.render("admin/add-mainCategory",{
        title:title
    });
});

router.post("/add-mainCategory", function(req,res){
    var title= req.body.title;
    var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();

    MainCategory.findOne({slug:slug},function(err,category){
        if(category){
            res.render("admin/add-category",{
                title:title
            });
        }else{
            var category = new MainCategory({
                title:title,
                slug:slug
            })
            category.save(function(err){
                if(err){console.log(err)}
                MainCategory.find(function (err, categories) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.app.locals.categories = categories;
                    }
                });
                    res.redirect("/admin/mainCategories");
            })
        }
    });
});

router.get("/edit-mainCategory/:slug",function(req,res){
    MainCategory.findOne({slug:req.params.slug}, function(err,category){
        if(err){console.log(err)}
        else{
            res.render("admin/edit-mainCategory",{
                title:category.title,
                slug:category.slug,
                id: category._id
            })
        }
    })
});


router.post("/edit-mainCategory/:slug",function(req,res){

    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
    var id = req.body.id;

    MainCategory.findOne({slug:slug,_id:{$ne:id}},function(err,category){
        if(category){
            res.render("admin/edit-mainCategory",{
                title:title,
                slug:slug
            })
        }else{
            MainCategory.findById(id,function(err,category){
                if(err){console.log(err)}
                else{
                    category.title=title,
                    category.slug=slug

                    category.save(function(err){
                        if(err)console.log(err);
                        MainCategory.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        })
                        res.redirect("/admin/mainCategories")
                    })
                }
            })
        }
    })
});

router.get("/delete-category/:id",function(req,res){
    MainCategory.findByIdAndRemove(req.params.id,function(err){
        if(err) console.log(err);

        MainCategory.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });
        
        res.redirect('/admin/mainCategories');
    })
});

module.exports = router;