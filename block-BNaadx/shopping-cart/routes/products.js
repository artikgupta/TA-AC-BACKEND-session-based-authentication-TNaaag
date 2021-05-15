var express = require('express');
var router = express.Router();

var User = require("../models/User");

var Product = require("../models/Product")



router.get("/create",(req,res, next)=>{
  const {userId} = req.session;
  User.findById(userId, (err, user) => {
    if(err||!user||!user.isAdmin) return next(err);
    return res.render("createProduct")
  })
})


router.post('/', (req, res, next) => {
  const {userId} = req.session;
  User.findById(userId, (err, user) => {
    if(err||!user||!user.isAdmin) return next(err);
    Product.create(req.body, (err, user) => {
      console.log(err, req.body);
      if (err) return next(err);
      res.redirect('/products');
    });
  })
  });



  router.get("/",(req,res,next)=>{
    const {userId}= req.session
    Product.find((err, products)=>{
      if(err) return next(err)
      User.findById(userId, (err, user) => {
        if(err) return next(err)
        res.render("allProducts",{products, user})
      })
    })
  })


  router.get("/:id/edit", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
    if(err||!user||!user.isAdmin) return next(err);
    let id = req.params.id;
    Product.findById(id,(err, product)=>{
      if(err) return next(err)
      res.render("updateProduct", {product})
    })
  })
  })

  router.post("/:id/edit", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
      if(err||!user||!user.isAdmin) return next(err);
    let id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, { new: true }, (err, product) => {
      if (err) next(err);
      res.redirect('/products/' + id);
    })
  })
  })


  router.get('/:id/delete', (req, res, next) => {
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
      if(err||!user||!user.isAdmin) return next(err);
    let id = req.params.id;
    Product.findByIdAndDelete(id, (err, deletedItem) => {
      if (err) next(err);
      res.redirect('/products/');
    });
  })
  });

  // add to cart

  router.get("/:id/cart", (req,res)=>{
    let {userId} = req.session;
    let productID = req.params.id;
    User.findById(userId, (err, user) => {
      if(err||!user) return next(err);
      Product.findById(productID, (err, items) => {
        if (err) next(err);
        User.findByIdAndUpdate(userId, {$push: {cart: items.id}} , {new: true}).exec((err, users
          ) => {
        if (err) next(err);
        res.redirect("/users/cart")
        })
      });
    })
    
  })

  
  
  router.get("/:id",(req,res,next)=>{
    const {userId} = req.session;
    let id = req.params.id;
    Product.findById(id,(err,product)=>{
     if(err) return next(err)
     User.findById(userId, (err, user) => {
      if(err) return next(err)
      res.render("SingleProduct",{product, user})
    })
    })
  })


// like

router.get("/:id/like",(req,res,next)=>{
  let id = req.params.id;
  Product.findByIdAndUpdate(id,{$inc: {likes: 1}}, (err, product) => {
    if(err) next(err);
    res.redirect(`/products/${id}`)
  })
})

// dislike


router.get("/:id/dislike",(req,res,next)=>{
  let id = req.params.id;
  Product.findByIdAndUpdate(id,{$inc: {likes: -1}}, (err, product) => {
    if(err) next(err);
    res.redirect(`/products/${id}`)
  })
})

module.exports = router;