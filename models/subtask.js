var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = require('./boards');

var subtaskSchema = mongoose.Schema({
	_boardid: { type: Schema.Types.ObjectId, ref: 'Board'},
	name: String,
	todos: Array,
	created_at: {
		type: Date,
		default: Date.now()
	}
});

var Subtask = module.exports = mongoose.model('Subtask', subtaskSchema)
