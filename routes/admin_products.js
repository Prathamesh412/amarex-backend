const express = require("express");
const router = express.Router();
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
const resizeImg = require("resize-img");
const Product = require("../models/product");
const Category = require("../models/category");

router.get("/",function(req,res){
    var count;

    Product.countDocuments(function(err,c){
        count=c;
    });

    Product.find({},function(err,products){
        res.render("admin/products",{
            products:products,
            count:count
        })
    });
});

router.get("/add-product",function(req,res){

    var title ="";
    var description ="";
    
    Category.find(function(err,categories){
        res.render("admin/add-product",{
            title:title,
            description:description,
            categories:categories
        })
    });

});

router.post("/add-product",function(req,res){

    var image = req.files.image.name;
    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
    var description = req.body.description;
    var category = req.body.category;

    Product.findOne({slug:slug},function(err,product){
        if(product){
            res.render("admin/add-product",{
                title:title,
                image:image,
                description:description,
                categories:categories
            });
        }else{
            var product = new Product({
                title:title,
                image:image,
                description:description,
                category:category,
                slug:slug
            })
            product.save(function(err){
                if(err){console.log(err)}
                else{
                    mkdirp("public/product_images/"+ product._id,function(err){
                        return console.log(err)
                    });
                    mkdirp("public/product_images/"+ product._id + "/gallery",function(err){
                        return console.log(err)
                    });
                    mkdirp("public/product_images/"+ product._id + "/gallery/thumbs",function(err){
                        return console.log(err)
                    });

                    if (image != "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + product._id + '/' + image;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }
                    
                    res.redirect("/admin/products");
                }
            }); // end of save functionality
        } // end of else
    });
});

// Edit product functionality
router.get('/edit-product/:id', function (req, res) {

    Category.find(function (err, categories) {

        Product.findById(req.params.id, function (err, p) {
            console.log(p);
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                var galleryDir = 'public/product_images/' + p._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_product', {
                            title: p.title,
                            description: p.description,
                            categories: categories,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p._id
                        });
                    }
                });
            }
        });

    });
});

router.post("/edit-product/:id",function(req,res){

    var image = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;

    Product.findOne({slug: slug, _id: {'$ne': id}}, function (err, p) {

        if(err) console.log(err);
        if(p) {
            alert("The Product exists");
            res.redirect('/admin/products/edit-product/' + id);
        }else{
            Product.findById(id, function(err,product){
                if(err) console.log(err)
                else{
                    product.title = title;
                    product.slug = slug;
                    product.description = description;
                    product.category = category;
                    if (image != "") {
                        product.image = image;
                    }

                    product.save(function(err){
                        if(err) console.log(err)

                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, function (err) {
                                    if (err)
                                        console.log(err);
                                });
                            }

                            var productImage = req.files.image;
                            var path = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(path, function (err) {
                                return console.log(err);
                            });
                        }
                        res.redirect('/admin/products/edit-product/' + id);
                    });
                }           
            })
        }
    })
});


// The below is the search functionality to be implemented in the front end
router.get("/search",(req,res)=>{
    var searchVar= req.query.searchterm;
    var count;

    Product.countDocuments(function(err,c){
        count=c;
    });
    // console.log(searchVar)
    Product.find({title: {'$regex': searchVar,'$options': 'i'}},function(err,products){
       console.log("The products is " + products);
        if (err) {
            return console.log("error: " + err);
          }
        res.render("admin/products",{
            products:products,
            count:count
        })
    })
});

//Exports
module.exports = router;
