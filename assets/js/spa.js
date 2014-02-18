angular.module('SPApp', ['ngRoute','ui.bootstrap','ui.bootstrap.tpls','toaster']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'assets/tpl/spa.html', controller: SpaCtrl}).
      // when('/add-user', {templateUrl: 'assets/tpl/add-new.html', controller: AddCtrl}).
      // when('/edit/:id', {templateUrl: 'assets/tpl/edit.html', controller: EditCtrl}).
      otherwise({redirectTo: '/'});
}]);

// toaster.pop('success', "title", "text");
// toaster.pop('error', "title", "text");
// toaster.pop('warning', "title", "text");
// toaster.pop('note', "title", "text");
        
function SpaCtrl($scope, $http, $modal, $log, toaster) {
  $scope.master = {};

  $scope.getUsers = function () {
    $http.get('api/users').success(function(data) {
      $scope.users = data;
      toaster.pop('note', "ShaBam!", "data loaded");
    });
  }


  $scope.new = function () {

    var modalInstance = $modal.open({
      templateUrl: 'assets/tpl/new-modal.html',
      backdrop: false,
      scope: $scope,
      controller: AddCtrl
    });

    modalInstance.result.then(function (user) {
      
      toaster.pop('success', "New Record!", "A new record was successfully created");
      $scope.getUsers();
    }, function () {
      $log.info('New Modal dismissed at: ' + new Date());
    });
  };

  $scope.edit = function (user) {
    $scope.user = user;

    var modalInstance = $modal.open({
      templateUrl: 'assets/tpl/edit-modal.html',
      backdrop: false,
      scope: $scope,
      controller: EditCtrl,
      resolve: {
        user: function () {
          return $scope.user;
        }
      }
    });

    modalInstance.result.then(function (user) {
        if (user === "deleted") {
            toaster.pop('error', "GoodBye!", "Record has been deleted");
        } else {
            toaster.pop('success', "Updated!", "Record was successfully updated");
        }
      $scope.getUsers();
    }, function () {
      $log.info('Edit Modal dismissed at: ' + new Date());
    });
  };

  $scope.delete = function(user) {

    var deleteUser = confirm('Are you absolutely sure you want to delete?');
    if (deleteUser) {
      $http.delete('api/users/'+user.id);
      toaster.pop('error', "GoodBye!", "Record has been deleted");
      $scope.getUsers();
    }
  };
  
  $scope.reset = function() {
    $scope.user = angular.copy($scope.master);
  };

  //constructor
  $scope.getUsers();

}

function AddCtrl($scope, $http, $modalInstance) {

  $scope.add_new = function(user, AddNewForm) {

    $http.post('api/add_user', user).success(function(){
      $modalInstance.close(user);
    });

  };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function EditCtrl($scope, $http, $modalInstance, user) {
  $scope.user = user;
  var id = user.id;

  $scope.update = function(user){
    $http.put('api/users/'+id, user).success(function(data) {
      $modalInstance.close(data);
    });
  };

  $scope.delete = function(user) {
    console.log(user);

    var deleteUser = confirm('Are you absolutely sure you want to delete?');
    if (deleteUser) {
      $http.delete('api/users/'+user.id);
      $modalInstance.close("deleted");
    }
  };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
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