var express = require("express");
var router = require("router");
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var resizeImg = require("resize-img");
const Product = require("../models/product");



//Exports
module.exports = router;
