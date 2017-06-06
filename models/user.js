var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;

var Board = require('./boards')

var userSchema = new Schema({
  nickname: {
    type: String,
    unique:true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  password: "String",
  first_name: "String",
  last_name: "String",
  email: {
    type: "String",
    unique: true
  },
  boards: [{
    type: Schema.Types.ObjectId,
    ref:'Board'
  }]
})

userSchema.methods.comparePassword = function(candidatePassword, thisPassword, cb) {
    bcrypt.compare(candidatePassword, thisPassword, function(err, isMatch) {
      console.log(candidatePassword, thisPassword)
      console.log("thisMatch", isMatch)
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = module.exports = mongoose.model('User', userSchema)
