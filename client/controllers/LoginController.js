var appControllers = angular.module('app.controller', []);

appControllers.controller('LoginController', function($scope, $http, $state, Storage, AuthTokenFactory, toaster) {
  $scope.user = {};

  $scope.login = function(email, password) {
    $scope.loginError = null;
    var request_body = {
      email: email,
      password: password
    };

    $http.post('/api/login', request_body).then(function(response) {
      AuthTokenFactory.setToken(response.data.token);
      Storage.save('email', email)
      Storage.save('loggedIn', true)
      Storage.save('nickname', response.data.nickname)
      toaster.pop("success", "Zalogowano pomyślnie!");
      setTimeout(function() {
        $state.go('projects', {}, {
          reload: "projects"
        });
      }, 2000);
    }, function(err) {
      toaster.pop('error', 'Nieprawidłowe dane logowania.')
    })
  }
});
