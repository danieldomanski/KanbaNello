var mongoose = require('mongoose');

var User = mongoose.model('User');

exports.Signup = function(req, res) {
  var newuser = new User();

  newuser.nickname = req.body.nickname;
  newuser.email = req.body.email;
  newuser.first_name = req.body.first_name;
  newuser.last_name = req.body.last_name;
  newuser.password = req.body.password;

  newuser.save(function(error, data) {
    if (data) {
      res.json(data);
    } else if (error) {
      throw error
    }
  });
}

exports.Login = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    email: email
  }, function(err, user) {
    if (user == null) {
      res.status(400).end('No account with this email');
    } else {
      req.body.nickname = user.nickname;
      if (password == user.password) {
        next();
      } else {
        res.status(400).end('Invalid email or password');
      }
    }
  });
}
