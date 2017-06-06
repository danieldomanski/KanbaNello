var mongoose = require('mongoose');

var Schema = mongoose.Schema

var UploadSchema = mongoose.Schema({
  name: String,
  created: Date,
  file: Object,
  projectId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Upload', UploadSchema);
