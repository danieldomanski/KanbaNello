var appControllers = angular.module('app.controller');

appControllers.controller('ProjectsController', function($scope, $http, $uibModal, $log, Storage, $stateParams, $modal, $state, Upload, $window) {

  $scope.editing = false;
  $scope.toggleForm = true;
  $scope.formData = {}
  $scope.projekty = []
  $scope.lastProject = {}
  $scope.comments = []
  $scope.animationsEnabled = true;

  $scope.username = Storage.getUsername()

  //stworzenie zadania
  $scope.createProject = function() {
    //dane z widoku
    var req_body = {
      "name": $scope.formData.title,
      "description": $scope.formData.description,
      "tasks": [],
      "deadline": Date.now(),
      "created_by": $scope.username
    }

    $http.post('/api/project', req_body).then(function(response) {
      $scope.projekty.push(response.data)
      $scope.lastProject = response.data

      //automatycznie po stworzeniu zadania, stworz Board do podzadan
      var board_body = {
        "_projectid": $scope.lastProject._id,
        "name": req_body.name,
        "created_by": $scope.lastProject.created_by,
        "subtasks": $scope.lastProject.tasks,
        "deadline": $scope.lastProject.deadline
      }
      $http.post('/api/board?id=' + $scope.lastProject._id, board_body)
    })
  }

  //pobierz zadania do zmiennej "projekty"
  $scope.getProjects = function() {
    $http.get('/projects?created_by=' + Storage.getUsername()).then(function(response) {
      angular.extend($scope.projekty, response.data);
    })
  }

  //usun
  $scope.deleteProject = function(project) {
    this.$hide()
    $http.delete('/api/projects/delete/' + project._id).then(function(response) {
      $scope.getProjects()
      $state.reload()
    })
  }

  //dodaj komentarze w Modalu
  $scope.addComment = function(comment, project) {
    $http.post('/api/project/addcomment?id=' + project._id, {
      comment: comment
    }).then(function(response) {
      $scope.comments = response.data.comments
      $scope.clickedProject.comments.push(comment)
    })
  }

  //Upload w modalu

  $scope.deleteUploaded = function(upload) {
    $http.delete('/uploads/' + upload._id).then(function(response) {
      $http.get('/uploads').then(function(response) {
        $scope.uploads = response.data;
      });
    })
  }

  // pokaz Modal
  $scope.showProjectProperty = function(project) {
    $scope.clickedProject = project
    $scope.propertyModal = $modal({
      scope: $scope,
      show: true,
      placement: 'center',
      controller: 'ProjectsController',
      templateUrl: '../views/project_property_modal.html'
    });
  }

  //obserwuj zmiany zadania pod kątem zmiany daty deadlinu
  $scope.saveProjectToCtrl = function(project) {
    $scope.currentProject = project;

    $scope.$watch('currentProject.deadline', function(newValue, oldValue) {
      if (newValue != oldValue && oldValue) {
        $http.post('/api/projects/editDate', $scope.currentProject).then(function(response) {
          $state.reload();
        })
      }
    })
  }
  $scope.getProjects()

  //File upload
  $scope.submit = function() {
    $scope.upload.projectId = $scope.clickedProject._id
    Upload.upload({
      url: '/uploads',
      method: 'post',
      data: $scope.upload
    }).then(function(response) {
      console.log("POST: ", response.data);
      $scope.uploads.push(response.data);
      $scope.upload = {};
    })
  }

  //Get uploaded files
  $http.get('/uploads').then(function(response) {
    console.log(response.data);
    $scope.uploads = response.data;
  });

});
