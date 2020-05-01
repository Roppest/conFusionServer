const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite.js');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  .get(cors.cors,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    Favorites.find({user:req.user[0]._id})
      .populate('user')
      .populate('dishes')
      .then((favorites)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  //POST a set of dishes
  .post(cors.corsWithOptions,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    Favorites.findOne({user:req.user[0]._id})
    .then((favorites)=>
    {
      if(!favorites)//no favorite found
      {
        //create an empty favorites collection
        Favorites.create({user: req.user[0]._id, dishes:req.body})
        .then((newFavorite)=>
        {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(newFavorite);
        },(err)=>next(err)).catch((err)=>next(err));
      }
      else
      {
        //save only new favorite dishes
        let newFavorites = req.body;
        for(dish of newFavorites)
        {
          if(! favorites.dishes.includes(dish._id))
            favorites.dishes.push(dish)
        }
        favorites.save()
          .then((favorites)=>
          {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorites);
          },(err)=>next(err))
      }
    },(err)=>next(err)).catch((err)=>next(err));
  })
  .put(cors.corsWithOptions,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  //DELETE a user's favorite list
  .delete(cors.corsWithOptions,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    Favorites.findOneAndDelete({user:req.user[0].id})
    .then((favorites)=>
    {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(favorites);
    },(err)=>next(err)).catch((err)=>next(err));
  });

//--------------------/:dishId-------------------------------------

favoritesRouter.route('/:dishId')
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  //GET not supported
  .get(cors.cors,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  //POST add a favorite dish
  .post(cors.corsWithOptions,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    Favorites.findOne({user:req.user[0].id})
    .then((favorites)=>
    {
      if(!favorites)//no favorite found
      {
        //create an empty favorites collection
        Favorites.create({user: req.params.userId, dishes:[]})
        .then((newFavorite)=>
        {
          newFavorite.dishes.push(req.params.dishId);
          newFavorite.save();
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(newFavorite);
        },(err)=>next(err));
      }
      //save only new favorite dishes
      else if(! favorites.dishes.includes(req.params.dishId))
        favorites.dishes.push(req.params.dishId);
      favorites.save()
        .then((favorites)=>
        {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(favorites);
        },(err)=>next(err))
    },(err)=>next(err)).catch((err)=>next(err));
  })
  .put(cors.corsWithOptions,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .delete(cors.corsWithOptions,
  authenticate.verifyUser,
  (req,res,next)=>
  {
    Favorites.findOne({user:req.user[0].id})
    .then((favorites)=>
    {

      if(favorites !== null)
      {
        if(favorites.dishes !== null)
        {
          let index = favorites.dishes.indexOf(req.params.dishId);
          if(index >= 0)
            favorites.dishes.splice(index,1);
          else
          {
            err = new Error('Favorite dish "'+ req.params.dishId + '" not found.');
            err.status = 404;
            return next(err);
          }
          favorites.save()
          .then((favorites)=>
          {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorites);
          },(err)=>next(err))
        }
      }
      else
      {
        err = new Error('No favorite dishes found');
        err.status = 404;
        return next(err);
      }
    },(err)=>next(err)).catch((err)=>next(err));
  }
);

module.exports = favoritesRouter;
