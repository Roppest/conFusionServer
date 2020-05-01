const express = require ('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

const Promotions =  require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  .get(cors.cors,(req,res,next)=> //get promotions
  {
    Promotions.find({req.query})
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req,res,next) => //add promotion
  {
    Promotions.create(req.body)
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req,res,next) => //danger!!
  {
    Promotions.remove({})
      .then((deleted)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(deleted);
      },(err)=>next(err)).catch((err)=> next(err));
  }
);


promotionRouter.route('/:promoId')
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  .get(cors.cors,(req,res,next)=> //get promotion
  {
    Promotions.findById(req.params.promoId)
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported');
  })
  .put(cors.corsWithOptions,
     authenticate.verifyUser,
     authenticate.verifyAdmin,
     (req,res,next) => //update a promotion
  {
    Promotions.findByIdAndUpdate(req.params.promoId,
        {$set:req.body},
        {new:true}
      )
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req,res,next) => //danger!!
  {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then((promo)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
      },(err)=>next(err)).catch((err)=> next(err));
  }
);
//-----------------------------------------------

module.exports = promotionRouter; //export module
