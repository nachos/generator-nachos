'use strict';

angular.module('<%= name %>App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shell.main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'mainController'
      });
  });
