var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema(
  {//user and password are provided by passport-local-mongoose
    admin:{
      type: Boolean,
      default: false
    }
  }
);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);
