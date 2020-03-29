const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();

const Leaders = require('../models/leaders');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
  .get((req,res,next)=>
  {
    Leaders.find({})
      .then((leaders)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
      },(err)=>next(err)).catch((err)=> next(err));
  })
  .post((req,res,next)=>
  {
    Leaders.create(req.body)
      .then((leader)=>
      {
        console.log('Leader created:',leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
      },(err)=>next(err)).catch((err)=> next(err));
  })
  .put((req,res,next)=>
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .delete((req,res,next)=>
  {
    Leaders.remove({})
      .then((deleted)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(deleted);
      },(err)=>next(err)).catch((err)=> next(err));
  }
);

leaderRouter.route('/:leaderId')
  .get((req,res,next)=>
  {
    Leaders.findById(req.params.leaderId)
      .then((leaders)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
      },(err)=>next(err)).catch((err)=> next(err));
  })
  .post((req,res,next)=>//can't insert an item that doesn't exists
  {
    res.statusCode=403;
    res.end('Operation not supported');
  })
  .put((req,res,next)=>//update a leader
  {
    Leaders.findByIdAndUpdate(req.params.leaderId,
      {$set:req.body},
      {new:true}
    )
      .then((leader)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
      },(err)=>next(err)).catch((err)=> next(err));
  })
  .delete((req,res,next)=>
  {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((leader)=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
      },(err)=>next(err)).catch((err)=> next(err));
  }
);

module.exports = leaderRouter;
