'use strict';

angular.module('<%= name %>App')
  .controller('shellController', ['$scope', function ($scope) {
  var ngui = require('nw.gui');
  var nwin = ngui.Window.get();
  $scope.isFullScreen = false;

  $scope.close = function () {
    nwin.close();
  };

  $scope.toggleFullscreen = function (){
    if(!$scope.isFullScreen){
      nwin.maximize();
    }
    else{
      nwin.unmaximize();
    }
    $scope.isFullScreen = !$scope.isFullScreen;
  };

  $scope.hide = function (){
    nwin.minimize()
  };
}]);
