'use strict';
define(['angular','router','utility','service','bootstrap','xeditable'],
    function (angular,module,utility) {
        module.requires.push('service','xeditable');
        module.controller("frame", ['$scope', '$state', '$stateParams','$location', 'http','editableOptions','cache', function ($scope, $state, $stateParams,$location, http,editableOptions,cache) {
            editableOptions.theme = 'bs3';
            var user=utility.ls.get("user");
            utility.ls.set("cardsort",cache.cardsort);
            utility.ls.set("banksort",cache.banksort);
            utility.ls.set("epaysort",cache.epaysort);
            if(!user){
                return $state.go('login');
            }else{
                $scope.username=user.username;
            }


            $scope.signout=function () {
                http.login.fn("signout")(function (res) {
                    utility.ls.remove("user");
                    $state.go("login")
                })
            }

        }]);
    });







