'use strict';
define(['angular','router','utility','service'],
    function (angular,module,utility) {
      /*  var socket = io.connect('http://api.sokey.org:7002');

        socket.emit('req_auth', { user: 'kalaco' });*/

        //socket.on('openauth', function (data) {
        //    console.log(data);
        //    socket.emit('my other event', { my: 'data' });
        //});
        module.requires.push('service');
        module.controller("frame", ['$scope', '$state', '$stateParams','$location', 'http', function ($scope, $state, $stateParams,$location, http) {

            //菜单缩小，只省下图标
            $scope.leftMinified = false;
            //菜单极小，但还是有点
            $scope.leftMinimal = false;
            $scope.selectedindex = 0;
            $scope.childindex = 0;
            //面包屑
            $scope.breadcrumbs = [];
            //加载图标
            $scope.loading = {value: false};

            $scope.items=[
                {
                    "name":"管理首页",
                    "url":"/def",
                    "ico":"fa-home",
                    "selected":true,
                    "childs":[]
                },
                {
                    "name":"数据挖掘",
                    "ico":"fa-database",
                    "selected":false,
                    "childs":[{"name":"网站列表","url":"/url"},
                        {"name":"分类管理","url":"/category"},
                        {"name":"日志维护","url":"/log"}
                    ]
                }
            ];

            //缩小菜单
            $scope.minifyMenu = function () {
                $scope.leftMinified = !$scope.leftMinified;
            };

            //极小菜单
            $scope.minimalMenu = function () {
                $scope.leftMinimal = !$scope.leftMinimal;
            };

            //目录
            $scope.openClose = function (index) {
                //$scope.isopen=!$scope.isopen;
                //alert($scope.items[index].selected)
                //如果没有子菜单
                if ($scope.items[index].childs.length < 1) {
                    $scope.items[$scope.selectedindex].selected = false;

                    setLastSelectedIItem();
                    //设置面包屑
                    $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
                    $scope.breadcrumbs.push($scope.items[index]);
                    //设置选中状态
                    $scope.items[index].selected = true;
                    $scope.selectedindex = index;
                    $scope.childindex = 0;
                    return true;
                }
                //有子菜单
                if (index != $scope.selectedindex) {
                    $scope.items[$scope.selectedindex].selected = false;
                    setLastSelectedIItem();
                }
                $scope.items[index].selected = !$scope.items[index].selected;
                $scope.selectedindex = index;
            };
            //上次选中项设为false
            var setLastSelectedIItem = function () {
                if ($scope.items[$scope.selectedindex].childs.length < 1) {
                    if ($scope.items.length > $scope.selectedindex)
                        $scope.items[$scope.selectedindex].selected = false;
                }
                else {
                    if ($scope.items.length > $scope.selectedindex && $scope.items[$scope.selectedindex].childs.length > $scope.childindex)
                        $scope.items[$scope.selectedindex].childs[$scope.childindex].selected = false;
                }
            };
            //子菜单点击
            $scope.goTo = function (fIndex, index) {
                //不为自己的时候，添加加载
                //alert($location.path())
                var url = $scope.items[fIndex].childs[index].url;
                if (!($scope.selectedindex == fIndex && $scope.childindex == index)) {

                    if (url != "#" + $location.path()) $scope.loading.value = true;
                }
                setLastSelectedIItem();
                //设置面包屑
                $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
                $scope.breadcrumbs.push($scope.items[fIndex]);
                $scope.breadcrumbs.push($scope.items[fIndex].childs[index]);
                //设置选择状态
                $scope.items[fIndex].childs[index].selected = true;
                $scope.childindex = index;
            };
        }]);
    });







