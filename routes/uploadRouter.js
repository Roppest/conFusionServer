const express = require ('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage(
  {//by default multer would give a random string as a filename
    destination:(req,file,cb)=>{
      cb(null,'public/images');

    },
    filename: (req,file,cb)=>{
      cb(null, file.originalname)
    }
  }
);

const imageFileFilter = (req,file,cb)=>{//only accept image extensions
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    return cb(new Error('Only image files are allowed'),false);
  else
    cb(null,true);
};

const upload = multer(
  {
  storage: storage,
  fileFilter: imageFileFilter
  }
);
const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req,res,next) => //unsupported
  {
    res.statusCode=403;
    res.end('Operation not supported on /imageUpload');
  })
.post(cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  upload.single('imageFile'),
  (req,res)=>
  {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
  }
)
.put(cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req,res,next) => //unsupported
{
  res.statusCode=403;
  res.end('Operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req,res,next) => //unsupported
{
  res.statusCode=403;
  res.end('Operation not supported on /imageUpload');
});

module.exports = uploadRouter;
