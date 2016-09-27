
define([
    'angular',
    'ui.router'
], function (angular) {
    'use strict';
    var app = angular.module('router', [
        'ui.router'
    ])
        .config(['$stateProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$animateProvider',
            function ($stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,$animateProvider) {
                ModuleInjector(app,$stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,$animateProvider);
                $stateProvider
                    .state('login', load({
                        url: '/login',
                        controller: 'login',
                        templateUrl: '/tpl/login.html',
                        require: ['ctrl/login']
                    }))
                    .state('user',
                    load({
                        abstract: true,
                        controller: 'frame',
                        templateUrl: '/tpl/frame.html',
                        require: ['ctrl/frame']
                    }))
                    .state('user.category_url',
                    load({
                        url: '/category_url/:id',
                        controller: 'ctrl.category_url',
                        templateUrl: '/tpl/category_url.html',
                        require: ['ctrl/category_url']
                    }))
                ;
                   angular.forEach( ['def','url','category'],function(item){
                       $stateProvider.state('user.'+item, load({
                           url: '/'+item,
                           templateUrl: '/tpl/'+item+'.html',
                           controller: item,
                           require: ['ctrl/'+item]
                       }))
                   });

            }]);
    return app;
    function load(config){
        return angular.extend({
            resolve: {
                delay: ['$q', '$rootScope', 'moduleInjector', function ($q, $rootScope, moduleInjector) {
                    var defer = $q.defer();
                    require(config.require, function () {
                        var deps=app.requires;
                        if (deps && angular.isArray(deps) && deps.length > 0) moduleInjector(deps);
                        defer.resolve();
                        $rootScope.$apply();
                    });
                    return defer.promise;
                }]
            }
        }, config);
    }



    function ModuleInjector(app,$stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,$animateProvider) {

        //-------动态注入　开始-----------------------------------------------------------------
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.value = $provide.value;
        app.injector = function (moudles, fns) {
            moudles = moudles || [];
            moudles.push('ng');
            fns.forEach(function (fn) {
                app.value(fn, angular.injector(moudles).get(fn));
            })
        }
        $provide.factory('moduleInjector', ['$injector', '$log', function ($injector, $log) {
            var injected = {},
                invokeQueue = [],
                runBlocks = [],
                providers = {
                    $animateProvider: $animateProvider,
                    $compileProvider: $compileProvider,
                    $controllerProvider: $controllerProvider,
                    $filterProvider: $filterProvider,
                    $provide: $provide
                };

            return function (modules) {
                var mods=[];
                if (!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function (elt /*, from*/) {
                        var len = this.length >>> 0;
                        var from = Number(arguments[1]) || 0;
                        from = (from < 0)
                            ? Math.ceil(from)
                            : Math.floor(from);
                        if (from < 0)
                            from += len;
                        for (; from < len; from++) {
                            if (from in this &&
                                this[from] === elt)
                                return from;
                        }
                        return -1;
                    };
                }
                function loadModules(modulesToLoad) {
                    angular.forEach(modulesToLoad, function (module) {
                        if (mods.indexOf(module) == -1) {
                            mods.push(module);
                        }
                        var moduleFn = angular.module(module);
                        if (moduleFn.requires && moduleFn.requires.length > 0) {
                            loadModules(moduleFn.requires);
                        }
                    })
                }
                loadModules(modules); //加载所有，包括依赖的
                /*    angular.forEach(modules, function (item){
                 try {
                 var module = angular.module(item);
                 if (!module) return;

                 if (module.requires && module.requires.length > 0) {
                 for (var i in module.requires) {
                 if (mods.indexOf(module.requires[i]) == -1) {
                 mods.push(module.requires[i]);
                 }
                 }
                 }

                 if (mods.indexOf(item) == -1) {
                 mods.push(item);
                 }

                 } catch (ex) {
                 if (ex.message) {
                 ex.message += ' from ' + item;
                 $log.error(ex.message);
                 }
                 throw ex
                 }
                 })*/
                modules=mods;

                angular.forEach(modules, function (item, module) {
                    try {
                        if (!injected[item] && (module = angular.module(item))) {
                            invokeQueue = invokeQueue.concat(module._invokeQueue);
                            runBlocks = runBlocks.concat(module._runBlocks);
                            injected[item] = true;
                        }
                    } catch (ex) {
                        if (ex.message) {
                            ex.message += ' from ' + item;
                            $log.error(ex.message);
                        }
                        throw ex
                    }
                });
                angular.forEach(invokeQueue, function (item, provide) {
                    try {
                        item.length > 2 && providers.hasOwnProperty(item[0]) && (provide = providers[item[0]]) && provide[item[1]].apply(provide, item[2])
                    } catch (ex) {
                        if (ex.message) {
                            ex.message += ' from ' + JSON.stringify(item);
                            $log.error(ex.message);
                        }
                        throw ex
                    }
                });
                angular.forEach(runBlocks, function (item) {
                    $injector.invoke(item)
                });
                invokeQueue.length = 0;
                runBlocks.length = 0;
            }
        }]);
        //-------动态注入　结束-----------------------------------------------------------------


    }
});
