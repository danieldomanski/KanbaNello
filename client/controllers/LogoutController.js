var appControllers = angular.module('app.controller');

appControllers.controller('LogoutController', function($scope, toaster, $state, Storage) {

  $scope.logout = function() {
    Storage.remove('auth-token');
    Storage.remove('email');
    Storage.remove('nickname');
    Storage.remove('loggedIn');
    toaster.pop('success', "Zostałeś wylogowany!");
    setTimeout(function() {
      $state.go('login');
    }, 2000);
  }
});
