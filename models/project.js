// Projekt to dane pojedyncze zadanie z widoku głównego po zalogowaniu,
// po wybraniu Projektu, możemy przejść do widoku "BOARDS", gdzie
// beda na nas czekały zadania "TASKS"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user')

var projectSchema = mongoose.Schema({
  _userid: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_by: String,
  name: {
    type: String,
    unique: true
  },
  description: String,
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Board'
  }],
  comments: [String],
  created_at: {type: Date, default: Date.now()},
  deadline: Date
});

var Project = module.exports = mongoose.model('Project', projectSchema)
