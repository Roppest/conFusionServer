const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes.js');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .get((req,res,next)=> //get dishes
  {
    Dishes.find({})
      .then((dishes)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post((req,res,next) => //add dish
  {
    Dishes.create(req.body)
      .then((dish)=>
      {
        console.log('Dish created',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .put( (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .delete( (req,res,next) => //danger!!
  {
    Dishes.remove({})
    .then((resp)=>
    {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(resp);
    },(err)=>next(err)).catch((err)=>next(err));
  });
//---------------with dishId----------------
dishRouter.route('/:dishId')
  .get((req,res,next)=> //get a dish
  {
    Dishes.findById(req.params.dishId)
      .then((dishes)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err)).catch((err)=>next(err));
  })

  .post( (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported');
  })

  .put( (req,res,next) => //update a dish
  {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {$set: req.body},
      {new:true}
    )
      .then((dish)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .delete( (req,res,next) => //danger!!
  {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((resp)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      },(err)=>next(err)).catch((err)=>next(err));
  });
//-----------------------------------------------

module.exports = dishRouter; //export module
