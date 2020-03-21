const express = require ('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .all((req,res,next) =>//for all requests
  {
    res.statusCode=200;//default
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req,res,next)=> //get dish
  {
    res.end("This will send all dishes");
  })

  .post((req,res,next) => //add dish
  {
    res.end('Will add the dish: ' + req.body.name +
     ' with details: ' + req.body.description);
  })

  .put( (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })

  .delete( (req,res,next) => //danger!!
  {
    res.end('Deleting all dishes');
  });
//---------------with dishId----------------
dishRouter.route('/:dishId')
  .get((req,res,next)=> //get dish
  {
    res.end("This will send details of " + req.params.dishId);
  })

  .post( (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported');
  })

  .put( (req,res,next) => //update a dish
  {
    res.end('Updating dish: '+req.body.name);
  })

  .delete( (req,res,next) => //danger!!
  {
    res.end('Deleting dish: ' + req.params.dishId);
  });
//-----------------------------------------------

module.exports = dishRouter; //export module
