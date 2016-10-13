'use strict';
define(['angular','router','utility','service','xeditable','ui.bootstrap'],
    function (angular,module,utility) {
        module.requires.push('service','xeditable','ui.bootstrap');
        module.controller("user", ['$scope', '$state', '$stateParams','$modal', 'http', function ($scope, $state, $stateParams,$modal, http) {


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
                var query={};
                if($scope.dtFrom||$scope.dtTo){
                    var _dtFrom=!$scope.dtFrom?"":utility.dayTime($scope.dtFrom);
                    var _dtTo=!$scope.dtTo?"":utility.dayTime($scope.dtTo);
                    query.reg_time=utility.format("[%s,%s]",_dtFrom,_dtTo)
                }
                if($scope.uid)query.uid=$scope.uid;
                http.user.page({query:query,page:$scope.page},function(res){
                    if(res.err) return;
                    $scope.rows=res.data.rows;
                    $scope.page.count=res.data.count;
                });
            };
            //------------------搜索结束--------------
            $scope.search();
            //------------------编辑用户--------------
            // add url  添加网站对话框
            $scope.userEdit = function(uid) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_user_edit.html',
                    controller: ['$scope', '$modalInstance','http', function ($scope, $modalInstance,http) {
                        $scope.db={};
                        http.user.findOne({uid:uid},function (res) {
                            $scope.db=res.data;
                            console.log($scope.db)
                        })

                        $scope.update=function () {
                            if(!$scope.db)return;
                            http.user.update($scope.db,function (res) {

                            })

                        }

                        $scope.changeKey=function () {
                            if(!$scope.db)return;
                            http.user.fn("changeKey")($scope.db,function (res) {
                                $scope.db.key=res.data.key;
                            })
                        }

                        $scope.banks = [];
                        $scope.loadBanks=function () {
                            $scope.banks=[{
                                id:"icbc",
                                name:"中国工商银行"
                            },{id:"abc",
                                name:"农行"}]
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


            //------------------修改密码--------------
            $scope.pwdEdit = function(username) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_user_pwd.html',
                    controller: ['$scope', '$modalInstance','http', function ($scope, $modalInstance,http) {
                        $scope.db={username:username};
                        $scope.changePwd=function () {
                            if(!$scope.db)return;
                            http.user.fn("changePwd")($scope.db,function (res) {
                                $scope.msg="修改成功";
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
            //------------------冻结商户--------------
            $scope.freeze = function(row) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_user_freeze.html',
                    controller: ['$scope', '$modalInstance','http', function ($scope, $modalInstance,http) {
                        $scope.db=row;
                        $scope.freeze=function () {
                            if(!$scope.db)return;
                            http.user.fn("freeze")({uid:$scope.db.uid},function (res) {
                                $state.go('user.user',null,{reload:true});
                                $modalInstance.close();

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


            //------------------解冻商户--------------
            $scope.unfreeze = function(row) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_user_unfreeze.html',
                    controller: ['$scope', '$modalInstance','http', function ($scope, $modalInstance,http) {
                        $scope.db=row;
                        $scope.unfreeze=function () {
                            if(!$scope.db)return;
                            http.user.fn("unfreeze")({uid:$scope.db.uid},function (res) {
                                $modalInstance.close();
                                $state.go('user.user',null,{reload:true});
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



            //------------------清算比例--------------
            $scope.rate = function(row) {
                var modalInstance = $modal.open({
                    templateUrl: '/tpl/m_user_rate.html',
                    controller: ['$scope', '$modalInstance','http', function ($scope, $modalInstance,http) {
                        $scope.rows=[];
                        $scope.status=[{value:0,text:"关闭"},{value:1,text:"开启"}];
                        http.rate.find({uid:row.uid},function (res) {
                            console.log(res.data)
                            $scope.rows=res.data;

                        })

                        $scope.save=function () {
                            http.rate.update({uid:row.uid,rows:$scope.rows},function (res) {
                                $modalInstance.close();
                                $state.go('user.user',null,{reload:true});
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







