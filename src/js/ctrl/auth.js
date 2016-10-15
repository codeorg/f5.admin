'use strict';
define(['angular','router','utility','service','xeditable','ui.bootstrap'],
    function (angular,module,utility) {
        module.requires.push('service', 'xeditable', 'ui.bootstrap');
        module.controller("auth", ['$scope', '$state', '$stateParams', '$modal', 'http', function ($scope, $state, $stateParams, $modal, http) {


            //------------------日期开始-------------------
            $scope.uid = "";
            // $scope.dtTo = new Date();
            // $scope.dtFrom = new Date(new Date().setDate($scope.dtTo.getDate() -7));
            $scope.dtTo = null;
            $scope.dtFrom = null;
            $scope.openFrom = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.toOpened = false;
                $scope.fromOpened = true;
            };
            $scope.openTo = function ($event) {
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


            $scope.rows = [];
            //------------------分页开始--------------
            $scope.page = {pageNo: 1, pageSize: 1, count: 0, maxSize: 10};

            $scope.setPage = function (pageNo) {
                $scope.page.pageNo = pageNo;

            };

            $scope.pageChanged = function () {
                $scope.search()
            };
            //------------------分页结束--------------

            //------------------搜索开始--------------
            $scope.search = function () {
                var query = {status: 0};
                if ($scope.dtFrom || $scope.dtTo) {
                    var _dtFrom = !$scope.dtFrom ? "" : utility.dayTime($scope.dtFrom);
                    var _dtTo = !$scope.dtTo ? "" : utility.dayTime($scope.dtTo);
                    query.reg_time = utility.format("[%s,%s]", _dtFrom, _dtTo)
                }
                if ($scope.uid)query.uid = $scope.uid;
                http.user.page({query: query, page: $scope.page}, function (res) {
                    console.log(res)
                    if (res.err) return;
                    $scope.rows = res.data.rows;
                    $scope.page.count = res.data.count;
                });
            };
            //------------------搜索结束--------------
            $scope.search();
            //------------------审核--------------
            $scope.auth = function (row) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_auth.html',
                    controller: ['$scope', '$modalInstance', 'http', function ($scope, $modalInstance, http) {
                        $scope.db = row;
                        $scope.auth = function () {
                            if (!$scope.db)return;
                            http.user.fn("auth")($scope.db, function (res) {
                                $modalInstance.close();
                                $state.go("user.auth",null,{reload:true});
                            })

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
    })








