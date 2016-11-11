/**
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
require([
    'angular',
    'utility',
    'ui.router',
    'ngSanitize',
    'zh-cn',
    'angular-loading-bar',
    'router'
], function (angular,utility) {
    'use strict';
    //console.log('app start')
    var app = angular.module('app', ['router',
        'ui.router', 'ngSanitize','angular-loading-bar'
    ])
        .run(['$rootScope','$state','$stateParams', function ($rootScope,$state,$stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeStart', function (event, next, current, $scope) {

                var userMenus = {
                    withdraw: {
                        "withdraw_auth": "提现审核",
                        "withdraw_log": "提现已处理记录"
                    },
                    pay: {
                        "epay": "电子支付查询",
                        "card": "卡类支付查询"
                    },
                    user: {
                        "user": "商户列表",
                        "auth": "商户审核"
                    },

                    api:{
                        "doc": "接口文档",
                        "epaysort": "电子支付",
                        "cardsort": "卡类支付",
                        "banksort": "银行种类",
                    }
                };

                function getMenus() {
                    if (!next.name) return [];
                    var name = next.name.replace(/^user\.(\w+)/gi, '$1');
                    if (!name)return [];
                    var _meuns = [];
                    for (var key in userMenus) {
                        if (userMenus[key].hasOwnProperty(name)) {
                            for (var k2 in userMenus[key]) {
                                _meuns.push({id: k2, name: userMenus[key][k2]});
                            }
                            break;
                        }
                    }
                    return _meuns;
                }

                $rootScope._menus = getMenus();

                function _title() {

                    if (!next.name) return '';
                    var name = next.name.replace(/^user\.(\w+)/gi, '$1');
                    if (!name)return '';
                    for (var key in userMenus) {
                        if (userMenus[key].hasOwnProperty(name)) {
                            return userMenus[key][name];
                        }
                    }
                    return '';
                };

                $rootScope._title = _title();


            });

            $rootScope.aaa="aaaaaaaaaaa";


        }])
        .config(['$locationProvider', '$urlRouterProvider','cfpLoadingBarProvider','$httpProvider',
            function ($locationProvider, $urlRouterProvider,cfpLoadingBarProvider,$httpProvider) {
                //$httpProvider.defaults.useXDomain = true;
                //delete $httpProvider.defaults.headers.common['X-Requested-With'];
                $httpProvider.interceptors.push('httpHandle');
                $urlRouterProvider.otherwise('/login');
                cfpLoadingBarProvider.includeSpinner = false;
                $locationProvider.html5Mode(true);
            }])
        .factory('httpHandle', ['$q','$injector','$window',function ($q,$injector,$window) {
            return {
                request: function (req) {
                    req.headers = req.headers || {};
                    //第一个字母必须大写如：Token,Sokey
                    //req.headers["Token"] = "test";
                    //请求是可以通过
                    return req;
                },
                response: function (res) {
                    if(res.data&&typeof res.data==="object"){
                        //console.log(res)
                        if(res.data.err===401){
                            //var $state=$injector.get('$state');
                            //if(!$state||!$state.current||!$state.current.name) return window.location.href="/login";
                            //$state.go('login',null,{reload:true});
                            $window.location.href="/login";
                        }
                    }
                    return res || $q.when(res);
                },
                responseError: function(rejection) {
                    return $q.reject(rejection);
                }
            };
        }])
            .filter('aaa',function(){
                return function(value){
                   console.log("11111")
                    return value+"111";
                }
            })
        ;

    angular.bootstrap(document, ['app']);
    return app;
});
