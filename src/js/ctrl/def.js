'use strict';
define(['angular','router','utility','service'],
    function (angular,module,utility) {
        module.requires.push('service');
        module.controller("def", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {
            $scope.test=  utility.date();
                http.demo.test(function (res) {
                $scope.test= res;
            });
        }]);
    });







