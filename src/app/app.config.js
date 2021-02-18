angular.
  module('exampleApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/', {
          template: '<example></example>'
        }).
        otherwise('/')
    }
  ])