angular.
  module('example').
  component('example', {
    templateUrl: 'app/example/example.template.html',
    controller: ['$scope', '$rootScope', function ExampleControlller($scope, $rootScope) {
      this.title = 'Angular 1.6.9'
      this.subtitle = 'Template'

      this.changeSubtitle = function () {
        this.subtitle = 'It works!'
      }
    }]
  })