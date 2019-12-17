const express = require("express");
const router = express.Router();
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
const resizeImg = require("resize-img");
const Product = require("../models/product");
const Category = require("../models/category");
const MainCategory = require("../models/mainCategory");
var Search = require("../models/search");

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

router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;
    Product.countDocuments(function(err,c){
        count=c;
    });

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('admin/products', {
                title: c.title,
                products: products,
                count:count
            });
        });
    });

});

router.get("/add-product",function(req,res){

    var title ="";
    var description ="";
    var productID = "";
  
    MainCategory.find({},function(err,mainCategories){

        Category.find(function(err,categories){
            res.render("admin/add-product",{
                title:title,
                description:description,
                categories:categories,
                mainCategories:mainCategories,
                productID:productID
            })
        });
    });

});

router.post("/add-product",function(req,res){

    console.log(req.files)
    var mainImage = req.files.mainImage.name;
    if(typeof req.files.thumbImage1 !== "undefined"){
    var thumbImage1 = req.files.thumbImage1.name;
    }else{
        var thumbImage1 ="";
    }
    if(typeof req.files.thumbImage2 !== "undefined"){
        var thumbImage2 = req.files.thumbImage2.name;
    }
    else{
        var thumbImage2 ="";
    }
    if(typeof req.files.thumbImage3 !== "undefined"){
        var thumbImage3 = req.files.thumbImage3.name;
    }else{
        var thumbImage3 ="";
    }
    
    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
    var description = req.body.description;
    var category = req.body.category;
    var mainCategory = req.body.mainCategory;
    var productID = req.body.productID

    Product.findOne({slug:slug},function(err,product){
        if(product){
            res.render("admin/add-product",{
                title:title,
                mainImage:mainImage,
                thumbImage1:thumbImage1,
                thumbImage2:thumbImage2,
                thumbImage3:thumbImage3,
                description:description,
                categories:categories,
                mainCategories:mainCategories,
                productID:productID
            });
        }else{
            var product = new Product({
                title:title,
                mainImage:mainImage,
                thumbImage1:thumbImage1,
                thumbImage2:thumbImage2,
                thumbImage3:thumbImage3,
                description:description,
                category:category,
                slug:slug,
                mainCategory:mainCategory,
                productID:productID
            })
            product.save(function(err){
                if(err){console.log("The error while product save" + err)}
                else{
                    mkdirp("public/product_images/"+ product._id,function(err){
                        return console.log("The error for product images "+ err)
                    });
                    mkdirp("public/product_images/"+ product._id + "/gallery",function(err){
                        return console.log("The error for product images gallery "+ err)
                    });
                    mkdirp("public/product_images/"+ product._id + "/gallery/thumbs",function(err){
                        return console.log("The error for product images thumbnail "+ err)
                    });
                    // mkdirp("public/product_images/"+ product._id + "/gallery/recommendation",function(err){
                    //     return console.log(err)
                    // });

                    if (mainImage != "") {
                        var productImage1 = req.files.mainImage;
                        var path = 'public/product_images/' + product._id + '/' + mainImage;

                        productImage1.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    if (thumbImage1 != "") {
                        var productImage2 = req.files.thumbImage1;
                        var path = 'public/product_images/' + product._id + '/' + thumbImage1;

                        productImage2.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    if (thumbImage2 != "") {
                        var productImage3 = req.files.thumbImage2;
                        var path = 'public/product_images/' + product._id + '/' + thumbImage2;

                        productImage3.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    if (thumbImage3 != "") {
                        var productImage4 = req.files.thumbImage3;
                        var path = 'public/product_images/' + product._id + '/' + thumbImage3;

                        productImage4.mv(path, function (err) {
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

    MainCategory.find(function(err,mainCategories){
    
        Category.find(function (err, categories) {

            Product.findById(req.params.id, function (err, p) {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/products');
                } else {
                    var galleryDir = 'public/product_images/' + p._id + '/gallery';
                //  var recommendationDir = 'public/product_images/' + p._id + '/recommendation';
                    var galleryImages = null;
                //  var recommendationImages = null;

                    fs.readdir(galleryDir, function (err, files) {
                        if (err) {
                            console.log(err);
                        } else {
                            galleryImages = files;
                           // console.log("The gallery image is" + galleryImages)

                            res.render('admin/edit_product', {
                                product:p,
                                title: p.title,
                                description: p.description,
                                categories: categories,
                                category: p.category.replace(/\s+/g, '-').toLowerCase(),
                                mainCategories: mainCategories,
                                mainCategory: p.mainCategory.replace(/\s+/g, '-').toLowerCase(),
                                image: p.image,
                                galleryImages: galleryImages,
                                id: p._id,
                                productID:p.productID
                            });
                        }
                    });
                }
            });

        });
    })
});

router.post("/edit-product/:id",function(req,res){
    console.log(req.files);
    //var image = typeof req.files.product.mainImage !== "undefined" ? req.files.image.product.mainImage : "";
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var category = req.body.category;
    var mainCategory = req.body.mainCategory
    var pimage = req.body.pimage;
    var id = req.params.id;
    var productID = req.params.productID

    Product.findOne({slug: slug, _id: {'$ne': id}}, function (err, p) {

        if(err) console.log(err);
        if(p) {
            alert("The Product exists");
            res.redirect('/admin/products/edit-product/' + id);
        }else{
            Product.findById(id, function(err,product){
                if(err) console.log(err)
                else{
                    console.log(product);
                    product.title = title;
                    product.slug = slug;
                    product.description = description;
                    product.category = category;
                    product.mainCategory = mainCategory;
                    product.productID = productID;
                    // if (product.mainImage != "") {
                    //     product.image = image;
                    // }

                    product.save(function(err){
                        if(err) console.log(err)

                        if (image != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, function (err) {
                                    if (err)
                                    console.log(err);
                                });
                            }

                            var productImage = req.files.image;
                            var path = 'public/product_images/' + id + '/' + image;

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

/*
 * POST product gallery
 */
router.post('/product-gallery/:id', function (req, res) {

    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

    productImage.mv(path, function (err) {
        if (err)
            console.log(err);

        resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then(function (buf) {
            fs.writeFileSync(thumbsPath, buf);
        });
    });
    res.sendStatus(200);
});

/*
 * GET delete image
 */
router.get('/delete-image/:image', function (req, res) {

    var removeThumbnail1 = 'public/product_images/' + req.query.id + '/gallery/' + req.params.product.thumbImage1;
    var removeThumbnail2 = 'public/product_images/' + req.query.id + '/gallery/' + req.params.product.thumbImage2;
    var removeThumbnail3 = 'public/product_images/' + req.query.id + '/gallery/' + req.params.product.thumbImage3;

    fs.remove(removeThumbnail1, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/products/edit-product/' + req.query.id);
        }
    });

    fs.remove(removeThumbnail2, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/products/edit-product/' + req.query.id);
        }
    });

    fs.remove(removeThumbnail3, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/products/edit-product/' + req.query.id);
        }
    });

});

//Delete product
router.get("/delete-product/:id",function(req,res){

    var id = req.params.id;
    var path = "public/product_images/" + id;

    fs.remove(path, function(err){
        if(err){
            console.log("File removal error " + err)
        }else{
            Product.findByIdAndRemove(id, function(err){
                if(err) return console.log("Eror while deleting product "+ err)
            })
           
            res.redirect("/admin/products");
        }
    })
})


/*
 * POST product recommendation
 */
// router.post('/product-recommendation/:id', function (req, res) {

//     console.log(req.files);
//     var productImage = req.files.file;
//     var id = req.params.id;
//     var path = 'public/product_images/' + id + '/gallery/recommendation/' + req.files.file.name;
//     // var thumbsPath = 'public/product_images/' + id + '/recommendation/thumbs/' + req.files.file.name;

//     //     resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then(function (buf) {
//     //         fs.writeFileSync(path, buf);
//     //     });
//     // res.sendStatus(200);
// });

/*
 * GET delete image recommendation
 */
// router.get('/delete-recommendation/:image', function (req, res) {

//     var originalImage = 'public/product_images/' + req.query.id + '/gallery/recommendation/' + req.params.image;
//    // var thumbImage = 'public/product_images/' + req.query.id + '/recommendation/thumbs/' + req.params.image;

//     fs.remove(originalImage, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.redirect('/admin/products/edit-product/' + req.query.id);
//         }
//     });
// });


// The below is the search functionality to be implemented in the front end
router.get("/search",(req,res)=>{
    var searchVar= req.query.searchterm;
    var count;

    Product.countDocuments(function(err,c){
        count=c;
    });
    console.log(searchVar)
    // Category.find({title: {'$regex': searchVar,'$options': 'i'}}).populate('product').exec(function(err,searchlist){
    //    console.log("The products is " + searchlist);
    //     if (err) {
    //         return console.log("error: " + err);
    //     }
    //     res.render("admin/products",{
    //         products:searchlist,
    //         count:count
    //     })
    // })

     Search.find({title: {'$regex': searchVar,'$options': 'i'}}).exec(function(err,searchlist){
       console.log("The products is " + searchlist);
        if (err) {
            return console.log("error: " + err);
        }
        res.render("admin/search",{
            products:searchlist,
            count:count
        })
    })



});

//Exports
module.exports = router;
