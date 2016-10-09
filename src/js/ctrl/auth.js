'use strict';
define(['angular','router','utility','service','ui.bootstrap'],
    function (angular,module,utility) {
        module.requires.push('service','ui.bootstrap');
        module.controller("auth", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {
//------------------日期开始-------------------
            $scope.NOW;
            $scope.dtTo = new Date();
            $scope.dtFrom = new Date(new Date().setDate($scope.dtTo.getDate() -7));
            $scope.openFrom = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.toOpened = false;
                $scope.fromOpened = true;
            };
            $scope.openTo = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.toOpened = true;
                $scope.fromOpened = false;
            };
            $scope.clear = function () {
                $scope.dtFrom = null;
                $scope.dtTo = null;
            };
            $scope.sh={};
            //------------------日期开结束-----------------

        }]);
    });







