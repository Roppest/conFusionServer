const express = require ('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

const Promotions =  require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
  .get((req,res,next)=> //get promotions
  {
    Promotions.find({})
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post(authenticate.verifyUser,(req,res,next) => //add promotion
  {
    Promotions.create(req.body)
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .put(authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .delete(authenticate.verifyUser, (req,res,next) => //danger!!
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
  .get((req,res,next)=> //get promotion
  {
    Promotions.findById(req.params.promoId)
      .then((promos)=>
      {
        res.statusCode=200;
        res.setHeader('Content-Type','applitcation/json');
        res.json(promos);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post(authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported');
  })
  .put( authenticate.verifyUser,(req,res,next) => //update a promotion
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
  .delete(authenticate.verifyUser, (req,res,next) => //danger!!
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
