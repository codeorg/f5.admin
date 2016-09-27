/**
 * ng service
 * 公用方法提供者
 */
define([
    'angular',
    'utility',
    'ngResource',
], function (angular,utility) {
    'use strict';

     angular.module('service', ['ngResource'])
    /**
     * 远程数据操作，方法update,insert,find,remove
     * db.table.find(query,data,callback);
     */
         .factory( 'remote', ['$resource',function($resource) {
             function dbFactory(_type){
                 var obj = {},
                     host="http://www.codeorg.com:3000/",
                     fns = [
                         "find",
                         "findOne",
                         "update",
                         "remove",
                         "insert",
                         "test"
                     ],
                     _db_modules = ['demo'];//不可用关键字module

                 var getFn = function (module) {
                     var objCmd = {};
                     var command=(function (fn_name) {
                         return function (query, cb) {
                             if (typeof query == "function") {
                                 cb = query;
                                 query = {};
                             }
                             utility.ls.set("sid","sssssssss");
                             query._bid=utility.bid||"";
                             var sid=utility.ls.get("sid")||"";
                             if(sid)query._sid=sid;
                             var resource = $resource(host+_type.name+'/:m/:c', {m: '@m', c: '@c'});
                            return resource.save({m: module, c: fn_name}, query, function (res) {
                                 cb(res);
                             });
                         }
                     });
                     objCmd.fn = function (name) {
                         return new command(name);
                     };
                     for (var i in fns) {
                         objCmd[fns[i]] = new command(fns[i]);
                     }

                     return objCmd;
                 }
                 obj.module = function (name) {
                     return getFn(name);
                 }
                 for (var i in _db_modules) {
                     obj[_db_modules[i]] = (function (module) {
                         return getFn(module);
                         //return objCmd;
                     })(_db_modules[i]);
                 }
                 return obj;
             }
             return dbFactory;


         }])
         .factory('http',['remote',function(remote){
             return remote({name:"web"});
         }])
    /**
     * 重复数据验证
     */
        .factory( 'exist', ['db','$timeout', function(db,$timeout) {
            var obj={};
            //obj.validate=function(){}
            obj.validate=function($scope,vali,cb){
                var timeout;
                $scope.$watch(vali.watch,function(newValue){
                    if(newValue){
                        if(timeout){
                            $timeout.cancel(timeout);
                        }
                        timeout=$timeout(function(){
                            var query={};
                            if(vali.field){
                                query[vali.field]=newValue;
                            }else{
                                if(vali.watch.indexOf('.')==-1){
                                    query[vali.watch]=newValue;
                                }else{
                                    query[vali.watch.substring(vali.watch.indexOf('.')+1)]=newValue;
                                }
                            }
                            //if(!vali.key)vali.key='exist';
                            db.module(vali.module).exist({query:query},function(res){
                                /*if(res.err)return $scope[vali.key]=false; //不存在数据
                                 $scope[vali.key]=true;//存在数据*/
                                if(res.err)return cb(false);
                                cb(true);
                            });
                        },100);
                    }
                });

            }
            return obj;
        }])
        .directive('coFocus', function() {
            return {
                link: function(scope, element, attrs) {
                    scope.$watch(attrs.coFocus, function(value) {
                        if(value === true) {
                            element[0].focus();
                            var arr=attrs.coFocus.split('.');
                            scope[arr[0]][arr[1]]=false;
                        }
                    });
                }
            };
        })
        .filter('rating',function(){
            return function(item){
                if(item==5)return '惊喜';
                if(item==4)return '满意';
                if(item==3)return '一般';
                if(item==2)return '不满意';
                return '失望';
            }
        })
        .filter('range',function(){
            return function(item){
                if(item>=1000)return Math.round(item/1000) + 'km';
                if(item<1000)return Math.round(item)+'m';
            }
        })
        .filter('toText',function(){
            return function(html,length){
                return toText(html,length);
            }
        })
        .filter('html', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])

    /**
     * co-show指令，实现jquery.show(time)效果
     *
     * 对应html标签属性co-show,co-show-duration
     */
        .directive("coShow", function() {
            function link( $scope, element, attributes ) {

                // 设置监视属性.
                var expression = attributes.coShow;
                // 得到持续的时间（show(time)里的time，必须是数字）

                var duration = ( attributes.coShowDuration || 0 );

                duration=parseInt(duration);

                //初始化：执行co-show为flase时候隐藏
                if ( ! $scope.$eval( expression ) ) {
                    element.hide();
                }

                //监视co-show的值有没有改变，当改变时改变相应元素的显示状态（显示、隐藏）
                $scope.$watch(
                    expression,
                    function( newValue, oldValue ) {
                        // 第一次运行，不用改变其状态，它有默认状态
                        // 没有改变时，退出
                        if ( newValue === oldValue ) {  return; }

                        // 有改变时
                        if ( newValue ) {
                            //当co-show=true时，我们显示它
                            element
                                .stop( true, true )
                                .slideDown( duration )
                            ;
                        } else {
                            //当co-show=false，我们隐藏它
                            element
                                .stop( true, true )
                                .slideUp( duration )
                            ;

                        }

                    }
                );

            }
            // 返回指令配置.
            return({
                link: link,
                restrict: "A"
            });

        })


    var toText=function(html,length){
        html=html.replace(/\r/g,' ');
        html=html.replace(/\t/g,' ');
        html=html.replace(/\n/g,' ');
        html=html.replace(/&nbsp;/gi,' ');
        html=html.replace(/( )+/g,' ');
        html=html.replace(/<[^>]*>/gi,'');

        if(length&&length>0){
            if(html.length<=length) return html;
            return html.substr(0,length);
        }
        return html;
    };
});
