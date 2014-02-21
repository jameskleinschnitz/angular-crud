angular.module('CrudApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'assets/tpl/lists.html', controller: ListCtrl}).
      when('/add-products', {templateUrl: 'assets/tpl/add-new.html', controller: AddCtrl}).
      when('/edit/:id', {templateUrl: 'assets/tpl/edit.html', controller: EditCtrl}).
      otherwise({redirectTo: '/'});
}]);

function ListCtrl($scope, $http) {
  $http.get('api/products').success(function(data) {
    $scope.products = data;
  });
}

function AddCtrl($scope, $http, $location) {
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(product, AddNewForm) {

    $http.post('api/add_product', product).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/');
    });

    $scope.reset = function() {
      $scope.product = angular.copy($scope.master);
    };

    $scope.reset();

  };
}

function EditCtrl($scope, $http, $location, $routeParams) {
  var id = $routeParams.id;
  $scope.activePath = null;

  $http.get('api/product/'+id).success(function(data) {
    $scope.products = data;
  });

  $scope.update = function(product){
    $http.put('api/products/'+id, product).success(function(data) {
      $scope.products = data;
      $scope.activePath = $location.path('/');
    });
  };

  $scope.delete = function(product) {
    console.log(product);

    var deleteProduct = confirm('Are you absolutely sure you want to delete?');
    if (deleteProduct) {
      $http.delete('api/products/'+product.id);
      
      $http.get('api/products').success(function(data) {
        $scope.products = data;
      });
  
      $scope.activePath = $location.path('/');
    }
  };
}