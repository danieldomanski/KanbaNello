// "BOARDS" to model pojedynczego zadania "PROJEKTU", przechowuje dane na temat poszczególnego "PROEJKTU",
// możemy w nim definiować pomniejsze dane tj. "SUBTASK"

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var Subtasks = require('./subtask');
var Project = require('./project');

var boardSchema = mongoose.Schema({
  _projectid: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  name: {
    type: String
  },
  deadline: Date,
  subtasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Subtasks'
  }],
  created_at: Date,
  updated_at: Date
});

boardSchema.plugin(uniqueValidator);

var Boards = module.exports = mongoose.model('Boards', boardSchema)
