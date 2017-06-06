var appControllers = angular.module('app.controller');

appControllers.controller('SignupController', function($scope, $state, $http, toaster) {
  $scope.user = {}
  $scope.users = {}
  $scope.signupError = false

  $scope.getUsers = function() {
    $http.get('/api/register').then(function(response) {
      $scope.users = response;
    })
  }

  $scope.addUser = function() {
    console.log("scopeUser: " + $scope.user);
    if ($scope.user.password !== $scope.user.confirmPassword) {
      toaster.pop('danger', 'Wprowadzone hasła nie są identyczne. Spróbuj jeszcze raz.');
      $scope.user.password = "";
      $scope.user.confirmPassword = "";
      return;
    }
    $http.post('/api/register', $scope.user).then(function(response) {
      $scope.error = false
      toaster.pop('success', 'Pomyślnie zarejestrowano!');
      setTimeout(function() {
        $state.go('login');
      }, 2000);
    }, function(err) {
      if (err) {
        $scope.signupError = "Podana nazwa użytkownika lub email jest już w użyciu."
        $scope.error = true
      }
    })
  }

})
