'use strict';
define(['angular','router','utility','service'],
    function (angular,module,utility) {
        module.requires.push('service');
        module.controller("login", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {
            $scope.msg=""
            $scope.iscap=false;
            $scope.data={cap:{}};
            $scope.getCap =function (err) {
                http.login.fn("getcap")(function (res) {
                    $scope.img = res.data.url;
                    $scope.iscap=false;
                    $scope.data.cap.id = res.data.id;
                    $scope.data.cap.value = "";
                    if(!err)$scope.msg=""
                });
            }

            $scope.checkCap =function () {
                $scope.msg=""
                var value=$scope.data.cap.value;
                value=utility.trim(value);
                if(value.length==4){
                    http.login.fn("checkcap")({id:$scope.data.cap.id,value:value},function (res) {
                        if(!res.err){
                            if(res.data===true) {
                                $scope.iscap=true;
                            }else{
                                $scope.iscap=false;
                                $scope.msg="验证码出错"
                            }
                        }else {
                            if(res.err==22){
                                $scope.iscap=false;
                                $scope.img = res.data.url;
                                $scope.data.cap.id = res.data.id;
                            }
                        }

                        //$scope.img = res;
                    });
                }
            }
            $scope.getCap();

            $scope.submit=function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.signin();
                }

            }

            $scope.signin=function () {
                if(!$scope.data.username) return $scope.msg="用户名不能为空！";
                if(!$scope.data.password) return $scope.msg="密码不能为空！";
                if(!$scope.data.cap.value) return $scope.msg="验证码不能为空！";

                http.login.fn("signin")($scope.data,function (res) {
                    if (!res.err) {
                        //utility.ls.set("sid", res.data.sid);
                        utility.ls.set("user", res.data);
                        $state.go("user.def");
                    }else{
                        $scope.getCap(true);
                        $scope.msg=res.msg;
                    }
                })
            }

        }]);
    });







