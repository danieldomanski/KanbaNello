var appControllers = angular.module('app.controller');

appControllers.controller('BoardsController', function($scope, $http, Storage, $stateParams, $location, BoardService, $modal, $state) {

  $scope.username = Storage.getUsername()
  $scope.editing = false;
  $scope.formData = {};
  $scope.isCollapsedHorizontal = true

  //obserwowanie zmiany nazwy zadania
  $scope.$watch('editing', function(newValue, oldValue) {
    if (!newValue && $scope.projectTitle) {
      $http.post('/api/board/editname?id=' + $scope.Board._projectid, {
        name: $scope.projectTitle
      }).then(function(response) {
        $scope.getProject()
        $scope.getProjects()
      })
    }
  })
  
  //aktualizowanie danych kontrolera podczas zmiany stanu ui-routera
  $scope.$on('$locationChangeSuccess', function(next, current) {
    $scope.getBoard()
    $scope.getSubtasks()
  });

  //pobierz dane boardu do $scope
  $scope.getBoard = function() {
    BoardService.getBoard($location.search().id).
    then(function(response) {
      $scope.Board = response.data[0]
      $scope.getProject()
    })
  }
  $scope.getBoard()


  $scope.getProject = function() {
    $http.get('/api/project/' + $location.search().id).then(function(response) {
      $scope.project = response.data
    })
  }

  //stworz podzadanie
  $scope.createSubtask = function() {
    var req_body = {
      id: $scope.Board._projectid,
      name: $scope.formData.list_title,
    }
    BoardService.createSubtask(req_body)
      .then(function(response) {
        $scope.lista.push(response.data)
      })
  }

  $scope.getSubtasks = function() {
    BoardService.getSubtasks($location.search().id).
    then(function(response) {
      $scope.lista = response.data
    })
  }
  $scope.getSubtasks()

  $scope.deleteSubtask = function(list) {
    BoardService.deleteSubtask(list._id).
    then(function(err, subtask) {
      $scope.getSubtasks()
    })
  }
  //dodaj mini-zadanie do podzadania
  $scope.createTodo = function(list) {
    var req_body = {
      name: list.title,
      id: list._id
    }
    BoardService.createTodo(req_body).
    then(function(response) {
      list.todos.push(response.data.todos[response.data.todos.length - 1])
    })
  }

  $scope.deleteTodo = function(task, list) {
    var req_body = {
      name: task,
      id: list._id
    }
    BoardService.deleteTodo(req_body).
    then(function(response) {
      var ind = list.todos.indexOf(task)
      if (ind > -1) {
        list.todos.splice(ind, 1);
      }
    })
  }

  $scope.getProjects = function() {
    $http.get('/projects?created_by=' + Storage.getUsername()).then(function(response) {
      $scope.projekty = response.data
    })
  }
  $scope.getProjects()
});
