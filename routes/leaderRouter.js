const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
  .all((req,res,next)=>
  {
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
  })
  .get((req,res,next)=>
  {
    res.end('This will send all leaders.');
  })
  .post((req,res,next)=>
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .put((req,res,next)=>
  {
    res.end('This will add the leader: ' + req.body.name +
      ' with details: ' + req.body.description);
  })
  .delete((req,res,next)=>
  {
    res.end('Deleting all leaders.')//Danger!!
  });

leaderRouter.route('/:leaderId')
  .all((req,res,next)=>
  {
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
  })
  .get((req,res,next)=>
  {
    res.end('This will send details of: ' + req.params.leaderId);
  })
  .post((req,res,next)=>
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .put((req,res,next)=>
  {
    res.end('Updating leader: '+req.params.leaderId);
  })
  .delete((req,res,next)=>
  {
    res.end('Deleting leader: '+req.params.leaderId);
  });

module.exports = leaderRouter;
