'use strict';
define(['angular','router','utility','service','xeditable','ui.bootstrap'],
    function (angular,module,utility) {
        module.requires.push('service','xeditable','ui.bootstrap');
        module.controller("withdraw_log", ['$scope', '$state', '$stateParams','$modal', 'http', function ($scope, $state, $stateParams,$modal, http) {


        //------------------日期开始-------------------
            $scope.uid="";
            // $scope.dtTo = new Date();
            // $scope.dtFrom = new Date(new Date().setDate($scope.dtTo.getDate() -7));
            $scope.dtTo = null;
            $scope.dtFrom = null;
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
            //------------------日期开结束-----------------



            $scope.rows=[];
            //------------------分页开始--------------
            $scope.page={pageNo:1,pageSize:10,count:0,maxSize:10,order:'req_time desc'};

            $scope.setPage = function (pageNo) {
                $scope.page.pageNo = pageNo;

            };

            $scope.pageChanged = function () {
                $scope.search()
            };
            //------------------分页结束--------------

            //------------------搜索开始--------------
            $scope.search=function(){
                var query={status:'success'};
                if($scope.dtFrom||$scope.dtTo){
                    var _dtFrom=!$scope.dtFrom?"":utility.dayTime($scope.dtFrom);
                    var _dtTo=!$scope.dtTo?"":utility.dayTime($scope.dtTo);
                    query.req_time=utility.format("[%s,%s]",_dtFrom,_dtTo)
                }
                if($scope.uid)query.uid=$scope.uid;
                http.withdraw.page({query:query,page:$scope.page},function(res){
                    console.log(res)
                    if(res.err) return;
                    $scope.rows=res.data.rows;
                    $scope.total_fee=res.data.total_fee;
                    $scope.page.count=res.data.count;
                });
            };
            //------------------搜索结束--------------
            $scope.search();
            //------------------编辑用户--------------


            //------------------清算比例--------------
            $scope.open_withdraw = function(row) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_withdraw_auth.html',
                    controller: ['$scope', '$modalInstance','http', function ($scope, $modalInstance,http) {
                        $scope.db=row;

                        $scope.save=function () {
                            http.withdraw.update({wid:row.wid},function (res) {
                                $modalInstance.close();
                                $state.go('user.withdraw_auth',null,{reload:true});
                            });
                        }

                        //------------------取消--------------
                        $scope.cancel = function () {
                            $modalInstance.close();
                        };
                    }],

                    size: "md",
                    backdrop: 'static', /*  this prevent user interaction with the background  */
                    keyboard: false
                });
            }
        }]);
    });







