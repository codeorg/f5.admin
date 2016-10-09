'use strict';
define(['angular','router','utility','service','ui.bootstrap'],
    function (angular,module,utility) {
        module.requires.push('service','ui.bootstrap');
        module.controller("user", ['$scope', '$state', '$stateParams', 'http', function ($scope, $state, $stateParams, http) {
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



            $scope.rows=[];
            //------------------分页开始--------------
            $scope.page={pageNo:1,pageSize:1,count:0,maxSize:10};

            $scope.setPage = function (pageNo) {
                $scope.page.pageNo = pageNo;

            };

            $scope.pageChanged = function () {
                $scope.search()
            };
            //------------------分页结束--------------

            //------------------搜索开始--------------
            $scope.search=function(){
                http.user.page({query:{},page:$scope.page},function(res){
                    if(res.err) return;
                    $scope.rows=res.rows;
                    $scope.page.count=res.count;
                });
            };
            //------------------搜索结束--------------

            //------------------初始化开始--------------
            var init=function(){
                $scope.search();
            }
            init();

        }]);
    });







