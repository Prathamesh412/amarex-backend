const express = require("express");
const router = express.Router();
var fs = require('fs-extra');

const Product = require("../models/product");

const Category = require("../models/category");

//Get pages in front end

router.get("/",function(req,res){

    Product.find({},function(err,products){
        if (err) console.log(err)

        res.render("all-products",{
            products:products
        })
    })
});

router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });

});

router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });

});

router.get('/:category/:product', function (req, res) {

    var galleryImages = null;
    // var loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages
                        // loggedIn: loggedIn
                    });
                }
            });
        }
    });

});

module.exports = router;