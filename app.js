var expressJwt = require('express-jwt')
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require("body-parser")
var app = express()
var bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken')
var localStorage = require('node-localstorage')
var cookieParser = require('cookie-parser')
var path = require('path')


// polacz z baza danych
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/trellos')
var db = mongoose.connection

// Modele
var User = require('./models/user'),
  Project = require('./models/project'),
  Boards = require('./models/boards'),
  Subtask = require('./models/subtask')

// Routes files
var UserRoute = require('./routes/user'),
  ProjectRoute = require('./routes/project'),
  BoardsRoute = require('./routes/boards'),
  UploadRoute = require('./routes/upload')


app.locals.superSecret = 'wlqdprkrhtlvekdndhkdzrnez';
var jwtSecret = 'wlqdprkrhtlvekdndhkdzrnez'

// Middlewares
app.use(bodyParser.json());

app.use(express.static('client'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: __dirname + "/client"
  });
});


//autentykacja - not yet
app.use(expressJwt({
  secret: jwtSecret,
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({
  path: ['/', '/signup', '/login']
}));


// Routes
app.post('/api/register', UserRoute.Signup)

app.post('/api/login', UserRoute.Login, function(req, res) {
  var token = jwt.sign({
    username: req.body.username
  }, jwtSecret);

  res.status(200).send({
    token: token,
    nickname: req.body.nickname
  });
})

app.get('/projects', function(req, res) {
  console.log(req.body, req.params, req.query)
  Project.find({
    "created_by": req.query.created_by
  }, function(err, projects) {
    if (err) res.status(400).end()
    res.status(200).send(projects);
  });
})

app.post('/api/project', ProjectRoute.createProject)

app.get('/api/project/:id', ProjectRoute.getProject)

app.delete('/api/projects/delete/:id', ProjectRoute.deleteProject)

app.post('/api/projects/editDate', ProjectRoute.editDeadline)

app.post('/api/project/addcomment', ProjectRoute.addComment)

app.post('/api/board', BoardsRoute.createBoard)

app.get('/api/board/:id', BoardsRoute.show)

app.post('/api/board/editname', BoardsRoute.editName)

app.post('/api/subtask', BoardsRoute.createSubtask)

app.get('/api/subtasks/:id', BoardsRoute.getSubtasks)

app.delete('/api/subtasks/delete/:id', BoardsRoute.deleteSubtask)

app.post('/api/subtasks/createtodo', BoardsRoute.createTodo)

app.post('/api/subtasks/deletetodo', BoardsRoute.deleteTodo)

// Multer
app.use('/uploads', UploadRoute)

app.listen(3000)
console.log("Serwer nasluchuje do portu 3000...")
