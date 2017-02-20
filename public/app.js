// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// ROUTES
weatherApp.config(function ($routeProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })

    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })

    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })

});

// SERVICES
weatherApp.service('cityService', function() {
  this.city = "New York, NY";
});

// CONTROLLERS
weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {
  $scope.city = cityService.city;

  $scope.$watch('city', function() {
    cityService.city = $scope.city;
  });

  $scope.submit = function() {
    $location.path("/forecast");
  }
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {
  $scope.city = cityService.city

  $scope.days = $routeParams.days || '2';

  $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=fb42f9de5f36ab7934cec141d08fdede", {
    callback: "JSON_CALLBACK" }, { get: { method: "JSONP"}});

    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days});

    $scope.convertToFahrenheit = function(degK) {
      return Math.round((1.8 * (degK - 273)) + 32);
    }

    $scope.convertToDate = function(dt) {
      return new Date(dt * 1000);
    }
}]);


// CUSTOM DIRECTIVES
weatherApp.directive('weatherPanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/weatherPanel.htm',
    replace: true,
    scope: {
      weatherDay: "=",
      convertToStandard: "&",
      convertToDate: "&",
      dateFormat: "@"
    }
  }
});
