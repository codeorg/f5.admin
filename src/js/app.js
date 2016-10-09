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
            //web socket服务
            //var socket = io.connect('http://api.sokey.org:7002');
            //socket.emit('reg', {sid: sokey.ls.get('token')});

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeStart', function (event, next, current, $scope) {


                var userMenus = {
                    user: {
                        "user": "商户列表",
                        "auth": "商户审核"
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

            //db.config.find(function (res) {
            //    sokey.config.set(res.data);
            //})

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
        .factory('httpHandle', ['$q','$injector',function ($q,$injector) {
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
                        //获取不到
                        // if(res.headers('Token')){
                        //     utility.ls.set('token',res.headers('Token'));
                        //     console.log(res.headers('Token'));
                        // }
                    }
                    return res || $q.when(res);
                },
                responseError: function(rejection) {
                    if (rejection.status === 401) {
                        //statego($injector,codeorg);
                    }
                    return $q.reject(rejection);
                }
            };
        }])
        ;
    angular.bootstrap(document, ['app']);
    return app;
});
