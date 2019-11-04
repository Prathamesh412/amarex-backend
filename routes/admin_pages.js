const express= require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Page = require("../models/page")

router.get("/",function(req,res){
    Page.find({}).sort({sorting: 1}).exec(function(err, pages){
        res.render("admin/pages",{pages:pages})
    });
});

router.get("/add-page",function(req,res){
    var title = "";
    var slug = "";
    var content = "";

    res.render("admin/add_page",{
        title:title,
        slug:slug,
        content:content
    });
});

router.post("/add-page",function(req,res){
    
    console.log(req.body);
    check("title", "Title should not be empty").not().isEmpty();  
    check("content", "Content should not be empty").not().isEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    if (slug=="") var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
    var content = req.body.content;

    Page.findOne({slug:slug}, function(err,page){
        if(page){
            res.render("admin/add_page",{
                title:title,
                slug:slug,
                content:content
            });
        }else{
            var page = new Page({
                title:title,
                slug:slug,
                content:content,
                sorting:100
            });

            page.save(function(err){
                if(err){console.log(err)}
                else{
                res.redirect('/admin/pages');
                }
            });
        }

    });
});

router.post("/reorder-pages",function(req,res){
   var ids = (req.body['id[]'])

   var count = 0;

   for(var i=0; i< ids.length; i++){
       var id = ids[i];
       count++;

       (function(count){
           Page.findById(id, function(err,page){
               page.sorting = count;

               page.save(function(err){
                   if(err) return console.log(err);
               });

           });
       })(count);
   }
});

router.get("/edit-page/:slug",function(req,res){
    Page.findOne({slug: req.params.slug},function(err,page){
        if(err){
            console.log("There is an error in the edit page "+ err)
        }
        else{
            res.render("admin/edit-page",{
                title:page.title,
                slug:page.slug,
                content:page.content,
                id: page._id
            })
        }
    })
});

router.post("/edit-page/:slug",function(req,res){
    
    check("title", "Title should not be empty").not().isEmpty();  
    check("content", "Content should not be empty").not().isEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    if (slug=="") var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
    var content = req.body.content;
    var id = req.body.id;

    console.log(req.body.id);
    Page.findOne({slug:slug, _id:{$ne:id}}, function(err,page){
        if(page){
            alert("page exists. Try again");
            res.render("admin/add_page",{
                title:title,
                slug:slug,
                content:content
            });
        }else{
            Page.findById(id,function(err,page){
                page.title=title,
                page.slug=slug,
                page.content=content

                page.save(function(err){
                    if(err){console.log(err)}
                    else{
              //      res.redirect('/admin/pages/edit-page'+page.slug);
                        res.redirect('/admin/pages');
                    }
                });
            });   
        }

    });
});

router.get("/delete-page/:id",function(req,res){
    Page.findByIdAndRemove(req.params.id,function(err){
        if(err) console.log(err)

        res.redirect('/admin/pages');
    })
});

//Exports
module.exports = router;