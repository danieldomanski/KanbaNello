var mongoose = require('mongoose');

var Board = mongoose.model('Boards');
var Project = mongoose.model('Project');
var Subtask = mongoose.model('Subtask');

exports.createBoard = function(req, res) {
  var newBoard = new Board();

  newBoard._projectid = req.body._projectid;
  newBoard.name = req.body.name;
  newBoard.created_by = req.body.created_by;
  newBoard.subtasks = req.body.subtasks;
  newBoard.deadline = req.body.deadline;

  newBoard.save(function(error, data) {
    if (data)
      res.json(data);
    else if (error)
      throw error
  })
}

exports.show = function(req, res) {
  Board.find({
    _projectid: req.params.id
  }, function(err, board) {
    if (err) res.status(400).end()
    res.status(200).send(board);
  });
}

exports.createSubtask = function(req, res) {
  var newSubtask = new Subtask();

  newSubtask._boardid = req.body.id;
  newSubtask.name = req.body.name;
  newSubtask.todos = [];

  newSubtask.save(function(error, data) {
    if (data)
      res.json(data);
    else if (error)
      throw error
  })
}

exports.getSubtasks = function(req, res) {
  Subtask.find({
    _boardid: req.params.id
  }, function(err, subtasks) {
    if (err) res.status(400).end()
    res.status(200).send(subtasks);
  });
}

exports.deleteSubtask = function(req, res) {
  Subtask.findByIdAndRemove(req.params.id, function(err, subtask) {
    if (err) res.status(400).end()

    res.status(200).send(subtask)
  })
}

exports.createTodo = function(req, res) {
  Subtask.findById(req.body.id, function(err, subtask) {

    subtask.todos.push(req.body.name)
    subtask.save(function(err, todo) {
      if (err) {
        res.status(500).send(err)
      }
      res.send(todo);
    })
  })
}

exports.deleteTodo = function(req, res) {
  Subtask.findById(req.body.id, function(err, subtask) {
    subtask.todos.splice(subtask.todos.indexOf(req.body.name), 1)

    subtask.save(function(err, todo) {
      if (err) {
        res.status(500).send(err)
      }
      todo.title = req.body.name
      res.send(todo);
    })
  })
}

exports.editName = function(req, res) {
  Project.findById(req.query.id, function(err, board) {
    board.name = req.body.name
    board.save(function(err, todo) {
      if (err) {
        res.status(500).send(err)
      }
      res.send(todo);
    })
  })
}
