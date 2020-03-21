const express = require ('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
  .all((req,res,next) =>//for all requests
  {
    res.statusCode=200;//default
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req,res,next)=> //get promotions
  {
    res.end("This will send all promotions");
  })
  .post((req,res,next) => //add promotion
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .put( (req,res,next) => //unsupported
  {
    res.end('Will add the promotion: ' + req.body.name +
     ' with details: ' + req.body.description);
  })
  .delete( (req,res,next) => //danger!!
  {
    res.end('Deleting all promotions');
  });


promotionRouter.route('/:promoId')
  .get((req,res,next)=> //get promotion
  {
    res.end("This will send details of " + req.params.promoId);
  })
  .post( (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('POST not supported');
  })
  .put( (req,res,next) => //update a promotion
  {
    res.end('Updating promotion: ' + req.params.promoId);
  })
  .delete( (req,res,next) => //danger!!
  {
    res.end('Deleting promotion: ' + req.params.promoId);
  });
//-----------------------------------------------

module.exports = promotionRouter; //export module
