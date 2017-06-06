var mongoose = require('mongoose');

var Project = mongoose.model('Project');


exports.createProject = function(req, res) {
  var newProject = new Project();

  newProject.created_by = req.body.created_by;
  newProject.name = req.body.name;
  newProject.description = req.body.description;
  newProject.tasks = req.body.tasks;
  newProject.deadline = req.body.deadline;

  newProject.save(function(error, data) {
    if (data) {
      res.json(data);
    } else if (error) {
      throw error
    }
  });
}

exports.getProjects = function(req, res) {
  Project.find({"created_by": req.query.created_by}, function(err, projects) {
    res.status(200).send(projects);
  });
}

exports.editDeadline = function(req, res) {
  Project.findById(req.body._id, function(err, project){

    project.deadline = req.body.deadline

    project.save(function (err, projekt) {
            if (err) {
                res.status(500).send(err)
            }
            res.send(projekt);
        })
  })
}

exports.deleteProject = function(req, res) {
  Project.findByIdAndRemove(req.params.id, function(err, project){
    if(err) res.status(400).end()
    res.status(200).send(project)
  })
}

exports.addComment = function(req, res) {
  Project.findById(req.query.id, function(err, project){
    project.comments.push(req.body.comment)
    project.save(function (err, com) {
            if (err) {
                res.status(500).send(err)
            }
            res.send(com);
        })
  })
}

exports.getProject = function(req, res) {
  Project.findById(req.params.id, function(err, project){
        res.status(200).send(project);
  })
}
