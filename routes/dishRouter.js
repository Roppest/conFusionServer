const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Dishes = require('../models/dishes.js');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .get((req,res,next)=> //get dishes
  {
    Dishes.find({})
      .populate('comments.author')
      .then((dishes)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post(authenticate.verifyUser,(req,res,next) => //add dish
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
  .put(authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .delete(authenticate.verifyUser, (req,res,next) => //danger!!
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
  .get(authenticate.verifyUser,(req,res,next)=> //get a dish
  {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dishes)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err)).catch((err)=>next(err));
  })

  .post(authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported');
  })

  .put(authenticate.verifyUser, (req,res,next) => //update a dish
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
  .delete(authenticate.verifyUser, (req,res,next) => //danger!!
  {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((resp)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      },(err)=>next(err)).catch((err)=>next(err));
  }
);
//-----------------------------------------------

//-------------Handling comments---------------
dishRouter.route('/:dishId/comments')
  .get((req,res,next)=>  //get coments
  {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dish)=>
      {
        if(dish != null)
        {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(dish.comments);
        }
        else
        {
          err = new Error('Dish '+ req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .post(authenticate.verifyUser, (req,res,next) => //post a comment
  {
    Dishes.findById(req.params.dishId)
      .then((dish)=>
      {
        if(dish != null)
        {
          req.body.author = req.user[0]._id;
          console.log('req.user: ')
          console.log(req.user);
          console.log('req.body: ');
          console.log(req.body);
          dish.comments.push(req.body);
          dish.save()
            .then((dish)=>
            {
              Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>
                {
                  res.statusCode = 200;
                  res.setHeader('Content-Type','application/json');
                  res.json(dish);
                })
            },(err)=> next(err));
        }
        else
        {
          err = new Error('Dish '+ req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .put( authenticate.verifyUser,(req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported on /dishes/'+
      req.params.dishId+'/comments');
  })
  .delete(authenticate.verifyUser,(req,res,next) => //delete all comments from dish
  {
    Dishes.findById(req.params.dishId)
    .then((dish)=>
    {
      if(dish != null)
      {
        for (let i = (dish.comments.length - 1); i >=0; i--)
        {
          dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save()
          .then((dish)=>
          {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
          },(err)=> next(err));
      }
      else
      {
        err = new Error('Dish '+ req.params.dishId + 'not found');
        err.status = 404;
        return next(err);
      }
    },(err)=>next(err)).catch((err)=>next(err));
  }
);
//---------------with commentId----------------
dishRouter.route('/:dishId/comments/:commentId')
  .get((req,res,next)=> //get a comment
  {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dish)=>
      {
        if(dish != null &&
          dish.comments.id(req.params.commentId) != null)
        {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish != null)
        {
          err = new Error('Dish '+ req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
        else
        {
          err = new Error('Comment '+ req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
      },(err)=>next(err)).catch((err)=>next(err));
  })

  .post(authenticate.verifyUser, (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported on /dishes/' + req.params.dishId +
    '/comments/' + req.params.commentId);
  })

  .put( authenticate.verifyUser, (req,res,next) => //update a dish
  {
    Dishes.findById(req.params.dishId)
      .then((dish)=>
      {
        if(dish != null &&
          dish.comments.id(req.params.commentId) != null)
        {
          if(req.body.rating)
          {
            dish.comments.id(req.params.commentId).rating =
              req.body.rating;
          }
          if(req.body.comment)
          {
            dish.comments.id(req.params.commentId).comment =
              req.body.comment;
          }
          dish.save()
            .then((dish)=>
            {
              Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>
                {
                  res.statusCode = 200;
                  res.setHeader('Content-Type','application/json');
                  res.json(dish.comments.id(req.params.commentId));
                });
            }, (err)=>next(err));
        }
        else if (dish != null)
        {
          err = new Error('Dish '+ req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
        else
        {
          err = new Error('Comment '+ req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
      },(err)=>next(err)).catch((err)=>next(err));
  })
  .delete( authenticate.verifyUser, (req,res,next) => //danger!!
  {
    Dishes.findById(req.params.dishId)
    .then((dish)=>
    {
      if(dish != null &&
        dish.comments.id(req.params.commentId) != null)
      {
        dish.comments.id(req.params.commentId).remove();

        dish.save()
          .then((dish)=>
          {
            Dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish)=>
            {
              res.statusCode = 200;
              res.setHeader('Content-Type','application/json');
              res.json(dish);
            })
          },(err)=> next(err));
      }
      else if (dish != null)
      {
        err = new Error('Dish '+ req.params.dishId + 'not found');
        err.status = 404;
        return next(err);
      }
      else
      {
        err = new Error('Comment '+ req.params.dishId + 'not found');
        err.status = 404;
        return next(err);
      }
    },(err)=>next(err)).catch((err)=>next(err));
  }
);
//-----------------------------------------------


module.exports = dishRouter; //export module
