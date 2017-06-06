var appServices = angular.module('app.service', []);


appServices.service('Storage', function($window){
  var store = $window.localStorage;
      return{
            getUsername: getUsername,
            setUsername: setUsername,
            remove:remove,
            save:save
      };
    function getUsername() {
      return store.getItem('nickname');
    }
    function setUsername(username) {
      return store.setItem('nickname',username);
    }
    function remove(key){
      return store.removeItem(key);
    }
    function save(key,value){
      return store.setItem(key,value);
    }

});

appServices.service('AuthService', function($window){
     return {
       isLoggedIn: isLoggedIn
     };
     function isLoggedIn(){
       if($window.localStorage.getItem('loggedIn')){
         return true;
       }else{
         console.log("User is not logged in");
         return false;
       }
     }
});

appServices.service('BoardService', function($http, Storage){
   this.getBoard = function(_id) {
       return $http.get('/api/board/'+_id);
     };

     this.createSubtask = function(req_body) {
       return $http.post('/api/subtask/', req_body)
     };

     this.getSubtasks = function(_id) {
       return $http.get('api/subtasks/'+_id)
     }

     this.deleteSubtask = function(_id) {
       return $http.delete('/api/subtasks/delete/'+_id)
     }

     this.createTodo = function(req_body) {
       return $http.post('api/subtasks/createtodo', req_body)
     }

     this.deleteTodo = function(req_body) {
       return $http.post('/api/subtasks/deletetodo', req_body)
     }
});
