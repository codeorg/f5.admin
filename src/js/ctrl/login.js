'use strict';
define(['angular','router','utility','service'],
    function (angular,module,utility) {
        module.requires.push('service');
        module.controller("login", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {
            $scope.data={cap:{}};
            $scope.getCap =function () {
                http.login.fn("getcap")(function (res) {
                    $scope.img = res.data.url;
                    $scope.data.cap.id = res.data.id;
                });
            }

            $scope.checkCap =function () {
                var value=$scope.data.cap.value;
                value=utility.trim(value);
                if(value.length==4){
                    http.login.fn("checkcap")($scope.data.cap,function (res) {
                        if(!res.err){
                            if(res.data===true) {
                                console.log("验证码成功");
                            }else{
                                console.log("验证码失败");
                            }
                        }else {
                            if(res.err==22){
                                $scope.img = res.data.url;
                                $scope.data.cap.id = res.data.id;
                            }
                        }

                        //$scope.img = res;
                    });
                }
            }

            $scope.getCap();
        }]);
    });







