/**
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
require([
    'angular',
    'utility',
    'ui.router',
    'ngSanitize',
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
                /*var url = $state.current.url;
                 console.log(url);*/
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
