var myApp = angular.module('myApp', ['ui.router', 'ngCookies', 'app.service', 'app.factory',
                                    'app.controller', 'toaster', 'dndLists', 'ui.bootstrap', 'ngAnimate',
                                    'mgcrea.ngStrap', 'ui.bootstrap', 'ngFileUpload']);

myApp.config(function($datepickerProvider) {
  angular.extend($datepickerProvider.defaults, {placement:'bottom', dateFormat: 'dd-MM-yyyy', autoclose: true, trigger: 'click' });
});

myApp.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

myApp.run(function($rootScope, AuthService, $state) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    $window.location.reload();
    
    if (toState.authenticate && toState.name !== 'login' && !AuthService.isLoggedIn()) {
      event.preventDefault();
      $state.transitionTo('login');
    }
  });
});

myApp.config(['$qProvider', function($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'SignupController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signup.html',
      controller: 'SignupController'
    })
    .state('boards', {
      url: '/boards',
      templateUrl: 'views/boards.html',
      controller: 'BoardsController',
      authenticate: true
    })
    .state('projects', {
      url: '/projects',
      templateUrl: 'views/projects.html',
      controller: 'ProjectsController',
      authenticate: true
    })
});
