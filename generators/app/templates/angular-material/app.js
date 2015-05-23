'use strict';
angular.module('<%= name %>App', ['ngMaterial', 'ui.router'])
  .config(function ($mdThemingProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');

    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('orange');
  });

