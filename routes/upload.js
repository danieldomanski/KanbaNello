var express = require('express');
var router = express.Router();
var fs = require('fs');
var Upload = require('../models/upload');
var multer = require('multer');

//multer konfig
var upload = multer({
  dest: 'uploads/'
});

//Gets the list of all files from the database
router.get('/', function(req, res, next) {
  Upload.find({}, function(err, uploads) {
    if (err) next(err);
    else {
      res.send(uploads);
    }
  });
});

//Gets a file from the hard drive based on the unique ID and the filename
router.get('/:uuid/:filename', function(req, res, next) {
  console.log(req.params);

  Upload.findOne({
    'file.filename': req.params.uuid,
    'file.originalname': req.params.filename
  }, function(err, upload) {

    if (err) next(err);
    else {
      res.set({
        "Content-Disposition": 'attachment; filename="' + upload.file.originalname + '"',
        "Content-Type": upload.file.mimetype
      });
      fs.createReadStream(upload.file.path).pipe(res);
    }
  });
});



//Create's the file in the database
router.post('/', upload.single('file'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  var newUpload = {
    name: req.body.name,
    created: Date.now(),
    file: req.file,
    projectId: req.body.projectId
  };
  Upload.create(newUpload, function(err, next) {
    if (err) {
      next(err);
    } else {
      res.send(newUpload);
    }
  });
});

router.delete('/:id', function(req, res) {
  Upload.findOneAndRemove({
    '_id': req.params.id
  }, function(err, upload) {
    res.send(upload)
  });
})

module.exports = router;
