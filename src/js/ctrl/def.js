'use strict';
define(['angular','router','utility','service'],
    function (angular,module,utility) {
        module.requires.push('service');
        module.controller("def", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {

            // $scope.test = utility.date();
            // http.demo.test({sss: 1, dsfsd: {like: "you"}}, function (res) {
            //     $scope.img = res.url;
            // });



        }]);
    });







