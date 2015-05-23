'use strict';

angular.module('<%= name %>App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shell', {
        abstract: true,
        controller: 'ShellController',
        templateUrl: 'app/shell/shell.html'
      });
  });
