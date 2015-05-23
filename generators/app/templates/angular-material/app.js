'use strict';
angular.module('<%= name %>App', ['ngMaterial', 'ui.router'])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('orange');
  });
