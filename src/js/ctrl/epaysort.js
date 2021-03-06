'use strict';
define(['angular','router','utility','service'],
    function (angular,module,utility) {
        module.requires.push('service');
        module.controller("epaysort", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {

            $scope.rows=[];
            http.epaysort.find(function (res) {
                console.log(res)
                $scope.rows=res.data;
            })

            $scope.status=[{value:0,text:"关闭"},{value:1,text:"开启"}];
            $scope.sps=[{value:"yeepay",text:"yeepay"},{value:"wx",text:"wx"},{value:"alipay",text:"alipay"}];
            //save
            $scope.saveRow = function(data,index) {
                var db=data;
                if($scope.rows.length>index){
                    db._id=$scope.rows[index].id;
                }
                http.epaysort.update(db,function(res){
                    //$scope.rows[index]._id=db.id;
                });
            };

            $scope.removeRow = function(index) {
                http.epaysort.remove({id:$scope.rows[index].id},function(res){
                    console.log(res);
                    $scope.rows.splice(index, 1);
                });
            };

            $scope.addRow = function() {
                if(!$scope.rows)$scope.rows=[];
                $scope.inserted  = {rate:98,
                    status:1
                };
                $scope.rows.push($scope.inserted);
            };

            $scope.goBankSort=function () {
                $state.go("user.banksort");
            }

        }]);
    });







