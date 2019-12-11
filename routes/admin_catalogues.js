const express= require("express");
const router = express.Router();
const Catalogue = require("../models/catalogue");

router.get("/",function(req,res){
    Catalogue.find({},function(err,catalogues){
        if (err) console.log(err);

        res.render("admin/catalogues",{
            catalogues:catalogues
        });
    });
});

router.get("/add-catalogue",function(req,res){
    var title = "";
    res.render("admin/add-catalogue",{
        title:title
    });
});

router.post('/uploadfile',function(req,res){
    console.log(req.files);
    if(req.files.upfile){
      var file = req.files.upfile,
        name = file.name,
        type = file.mimetype;
      var uploadpath = 'public/uploads/' + name;
      file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.send("Error Occured!")
        }
        else {
          console.log("File Uploaded",name);
            console.log(req.body);
            var categoryName= req.body.name;
            var slug = req.body.name.replace(/\s+/g, "-").toLowerCase();

                Catalogue.findOne({file:uploadpath},function(err,catalogue){
                    if(catalogue){
                        res.render("admin/add-catalogue",{
                            name:categoryName
                        });
                    }else{
                        var catalogue = new Catalogue({
                            name:categoryName,
                            slug:slug,
                            file:uploadpath
                        })
                        catalogue.save(function(err){
                            if(err){console.log(err)}
                            else{
                            res.redirect("/admin/catalogues");
                            }
                        })
                    }
                });
            }
        });
    }
    else {
      res.send("No File selected !");
      res.end();
    };
});

router.get("/delete-catalogue/:id",function(req,res){
    Catalogue.findByIdAndRemove(req.params.id,function(err){
        if(err) console.log(err);

        Catalogue.find(function (err, catalogue) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.catalogue = catalogue;
            }
        });
        
        res.redirect('/admin/catalogues');
    })
});



module.exports = router;