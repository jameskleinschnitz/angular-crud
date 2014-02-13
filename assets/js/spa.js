angular.module('SPApp', ['ngRoute','ui.bootstrap','ui.bootstrap.tpls']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'assets/tpl/spa.html', controller: SpaCtrl}).
      // when('/add-user', {templateUrl: 'assets/tpl/add-new.html', controller: AddCtrl}).
      // when('/edit/:id', {templateUrl: 'assets/tpl/edit.html', controller: EditCtrl}).
      otherwise({redirectTo: '/'});
}]);

function SpaCtrl($scope, $http, $modal, $log) {
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  $scope.getUsers = function () {
    $http.get('api/users').success(function(data) {
      $scope.users = data;
    });
  }

  $scope.items = ['item1', 'item2', 'item3'];//TODO: remove

  $scope.new = function () {

    var modalInstance = $modal.open({
      templateUrl: 'assets/tpl/new-modal.html',
      backdrop: false,
      scope: $scope,
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.edit = function () {

    var modalInstance = $modal.open({
      templateUrl: 'assets/tpl/edit-modal.html',
      backdrop: false,
      scope: $scope,
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.delete = function(user) {
    console.log(user);

    var deleteUser = confirm('Are you absolutely sure you want to delete?');
    if (deleteUser) {
      $http.delete('api/users/'+user.id);
      // $scope.activePath = $location.path('/');
      $scope.getUsers();
    }
  };

  //constructor
  $scope.getUsers();

}

function AddCtrl($scope, $http, $location) {
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(user, AddNewForm) {

    $http.post('api/add_user', user).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/');
    });

    $scope.reset = function() {
      $scope.user = angular.copy($scope.master);
    };

    $scope.reset();

  };
}

function EditCtrl($scope, $http, $location, $routeParams) {
  var id = $routeParams.id;
  $scope.activePath = null;

  $http.get('api/users/'+id).success(function(data) {
    $scope.users = data;
  });

  $scope.update = function(user){
    $http.put('api/users/'+id, user).success(function(data) {
      $scope.users = data;
      $scope.activePath = $location.path('/');
    });
  };

  $scope.delete = function(user) {
    console.log(user);

    var deleteUser = confirm('Are you absolutely sure you want to delete?');
    if (deleteUser) {
      $http.delete('api/users/'+user.id);
      $scope.activePath = $location.path('/');
    }
  };
}

var ModalCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'assets/tpl/add-new-modal.html',
      backdrop: false,
      scope: $scope,
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};