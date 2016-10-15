define(["dateFormat","lodash"],function (dateFormat,_) {
    'use strict';
    var toInt=function(obj){
        if(!obj) return 0;
        if(typeof obj==='number')return parseInt(obj);
        if(typeof obj!=='string')obj=obj.toString();
        if(isInt(obj))return parseInt(obj);
        if(isFloat(obj)){return Math.floor(parseFloat(obj));}//取整数
        return 0;
    }
    var toFloat=function(obj){
        if(!obj) return 0;
        if(typeof obj==='number')return parseFloat(obj);
        if(typeof obj!=='string')obj=obj.toString();
        if(isInt(obj))return parseInt(obj);
        if(isFloat(obj)){return parseFloat(obj);}
        return 0;
    }

    //整数
    var isInt=function(str){
        return /^-?\d+$/.test(str);
    }
    //浮点数
    var isFloat=function(str){
        return /^(-?\d+)(\.\d+)?$/.test(str);
    }

    var trim=function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    function isArray(ar) {
        return Array.isArray(ar);
    }

    var format = function(f) {
        var formatRegExp = /%[sdj%]/g;
        if (typeof f !=='string') {
            var objects = [];
            for (var i = 0; i < arguments.length; i++) {

                objects.push(arguments[i].toString());
            }
            return objects.join(' ');
        }
        var i = 1;
        var args = [];
        if(isArray(arguments[1]) || (typeof arguments[1]==='object'&& arguments[1].toString().indexOf('Arguments')!==-1)){
            args.push(f);
            [].push.apply(args,arguments[1]);
        }else{
            args=arguments;
        }
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x) {
            if (x === '%%') return '%';
            if (i >= len) return x;
            switch (x) {
                case '%s': return String(args[i++]);
                case '%d': return Number(args[i++]);
                case '%j':
                    try {
                        return JSON.stringify(args[i++]);
                    } catch (_) {
                        return '[Circular]';
                    }
                default:
                    return x;
            }
        });
        return str;
    };

    var formatObj=function(obj){
        if(isNullObj(obj)) return null;
        return obj;
    }

    var isNullObj=function(obj){
        if(!obj) return true;
        if(typeof obj==='object'){
            for (var key in obj){
                return false;
            }
            return true;
        }
        return false;
    }

    var formatIp=function(ip){
        ip.replace(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,function(a,b){
            ip=b;
        })
        return ip;
    }

    function formatMoney(obj){
        obj=toFloat(obj);
        return obj.toFixed(2);
    }

    //可以只有date(format)
    var date=function(dateTime,format){

        if(!dateTime)dateTime = new Date();
        var testD= new Date(dateTime);
        if(testD=="Invalid Date")dateTime = new Date();

        if(!format)format = 'yyyy-mm-dd'
        return dateFormat(dateTime, format);
    }
    //获取距离1970-1-1的ms(以天为单位)
    var dayTime=function(dateTime){
        "use strict";
        if(!dateTime)dateTime = new Date();
        dateTime=date(dateTime,'yyyy-mm-dd 00:00:00')
        dateTime=new Date(dateTime);
        return dateTime.getTime();
    }

    //增加/减少天数，默认下一天
    var setDay=function(dateTime,inc){
        if(!inc) inc=1;
        if(!dateTime)dateTime = new Date();
        if(typeof dateTime=="string" || typeof dateTime=="number") dateTime = new Date(dateTime);
        return dayTime(dateTime.setDate(dateTime.getDate() +inc));
    }





    // function isStringNumber(num) {
    //     return /^(-?\d+)(\.\d+)?$/.test(str);
    //     return /^-?\d+\.?\d*$/.test(num.replace(/["']/g, ''));
    // }

    function decodeUrl(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
            // Ignore any invalid uri component
        }
    }

    function encodeUrl(value) {
        return encodeURIComponent(value);
    }

    //----------ls　开始　------------------------------
    var ls = (function () {
        var storageType = 'localStorage', prefix = 'codeorg.', webStorage;
        var deriveQualifiedKey = function (key) {
            return prefix + key;
        };
        //是否支持
        var isSupported = (function () {
            try {
                var supported = (storageType in window && window[storageType] !== null);
                var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
                if (supported) {
                    webStorage = window[storageType];
                    webStorage.setItem(key, '');
                    webStorage.removeItem(key);
                }
                return supported;
            } catch (e) {
                //storageType = 'cookie';
                //$rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                return false;
            }
        }());

        var setLS = function (key, value) {
            if (!isSupported) return;
            if (!value) {
                value = "";
            } else if (typeof value != "string") {
                value = JSON.stringify(value);
            }
            //value = encodeUrl(value);
            if (webStorage) {
                webStorage.setItem(deriveQualifiedKey(key), value);
            }
        };

        var getLS = function (key) {
            if (!isSupported) return null;
            var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
            //item = decodeUrl(item);
            if (!item || item === 'null') {
                return null;
            }

            if (item.charAt(0) === "{" || item.charAt(0) === "[" || isFloat(item)) {
                return JSON.parse(item);
            }
            return item;
        };

        var removeLS = function (key) {
            if (!isSupported && !webStorage) return;
            webStorage.removeItem(deriveQualifiedKey(key));
        };

        var clearLS = function () {
            if (!isSupported && !webStorage) return;
            for (var key in webStorage) {
                if (key.indexOf(prefix) === 0) {
                    removeLS(key.substr(prefix.length));
                }
            }
        };

        return {
            get: getLS,
            set: setLS,
            remove: removeLS,
            clear: clearLS
        };
    })();
    //----------ls　开始　------------------------------


    //----------cookie　开始　------------------------------
    var cookie = (function () {
        var path = "/";

        function setCookie(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            if (!value) {
                value = null;
            } else if (typeof value != "string") {
                value = JSON.stringify(value);
            }

            value = encodeUrl(value);
            document.cookie = c_name + "=" + value + ((expiredays === null) ? "" : ";path=" + path + ";expires=" + exdate.toGMTString());
        }

        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if ((arr = document.cookie.match(reg)) !== null) {
                var value = decodeUrl(arr[2]);
                if (!value) return null;
                if (value.charAt(0) === "{" || value.charAt(0) === "[" || isFloat(value)) {
                    return JSON.parse(value);
                }
                e;
            }
            else
                return null;
        }

        function delCookie(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval !== null)
                document.cookie = name + "={};path=" + path + ";expires=" + exp.toGMTString();
        }

        return {
            get: getCookie,
            set: setCookie,
            remove: delCookie
        };
    })();
    //----------cookie　结束　------------------------------

    //----------地图距离　开始　------------------------------
    var DEF_PI = 3.14159265359; // PI
    var DEF_2PI = 6.28318530712; // 2*PI
    var DEF_PI180 = 0.01745329252; // PI/180.0
    var DEF_R = 6370693.5; // radius of earth
    //适用于近距离
    var getShortDistance = function (x1, y1, x2, y2) {
        var ew1, ns1, ew2, ns2;
        var dx, dy, dew;
        var distance;
        // 角度转换为弧度
        ew1 = x1 * DEF_PI180;
        ns1 = y1 * DEF_PI180;
        ew2 = x2 * DEF_PI180;
        ns2 = y2 * DEF_PI180;
        // 经度差
        dew = ew1 - ew2;
        // 若跨东经和西经180 度，进行调整
        if (dew > DEF_PI)
            dew = DEF_2PI - dew;
        else if (dew < -DEF_PI)
            dew = DEF_2PI + dew;
        dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
        dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
        // 勾股定理求斜边长
        distance = Math.sqrt(dx * dx + dy * dy);
        return distance;
    };
    //适用于远距离
    var getLongDistance = function (x1, y1, x2, y2) {
        var ew1, ns1, ew2, ns2;
        var distance;
        // 角度转换为弧度
        ew1 = x1 * DEF_PI180;
        ns1 = y1 * DEF_PI180;
        ew2 = x2 * DEF_PI180;
        ns2 = y2 * DEF_PI180;
        // 求大圆劣弧与球心所夹的角(弧度)
        distance = Math.sin(ns1) * Math.sin(ns2) + Math.cos(ns1) * Math.cos(ns2) * Math.cos(ew1 - ew2);
        // 调整到[-1..1]范围内，避免溢出
        if (distance > 1.0)
            distance = 1.0;
        else if (distance < -1.0)
            distance = -1.0;
        // 求大圆劣弧长度
        distance = DEF_R * Math.acos(distance);
        return distance;
    };
    //----------地图距离　结束　------------------------------

    //----------浏览器指纹　开始　------------------------------
    //必须闭包
    var fingerprint = (function () {
        var Fingerprint = function (options) {
            var nativeForEach, nativeMap;
            nativeForEach = Array.prototype.forEach;
            nativeMap = Array.prototype.map;

            this.each = function (obj, iterator, context) {
                if (obj === null) {
                    return;
                }
                if (nativeForEach && obj.forEach === nativeForEach) {
                    obj.forEach(iterator, context);
                } else if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        if (iterator.call(context, obj[i], i, obj) === {}) return;
                    }
                } else {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            if (iterator.call(context, obj[key], key, obj) === {}) return;
                        }
                    }
                }
            };

            this.map = function (obj, iterator, context) {
                var results = [];
                // Not using strict equality so that this acts as a
                // shortcut to checking for `null` and `undefined`.
                if (obj == null) return results;
                if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
                this.each(obj, function (value, index, list) {
                    results[results.length] = iterator.call(context, value, index, list);
                });
                return results;
            };

            if (typeof options == 'object') {
                this.hasher = options.hasher;
                this.screen_resolution = options.screen_resolution;
                this.screen_orientation = options.screen_orientation;
                this.canvas = options.canvas;
                this.ie_activex = options.ie_activex;
            } else if (typeof options == 'function') {
                this.hasher = options;
            }
        };

        Fingerprint.prototype = {
            get: function () {
                var keys = [];
                keys.push(navigator.userAgent);
                keys.push(navigator.language);
                keys.push(screen.colorDepth);
                if (this.screen_resolution) {
                    var resolution = this.getScreenResolution();
                    if (typeof resolution !== 'undefined') { // headless browsers, such as phantomjs
                        keys.push(this.getScreenResolution().join('x'));
                    }
                }
                keys.push(new Date().getTimezoneOffset());
                keys.push(this.hasSessionStorage());
                keys.push(this.hasLocalStorage());
                keys.push(!!window.indexedDB);
                //body might not be defined at this point or removed programmatically
                if (document.body) {
                    keys.push(typeof(document.body.addBehavior));
                } else {
                    keys.push(typeof undefined);
                }
                keys.push(typeof(window.openDatabase));
                keys.push(navigator.cpuClass);
                keys.push(navigator.platform);
                keys.push(navigator.doNotTrack);
                keys.push(this.getPluginsString());
                if (this.canvas && this.isCanvasSupported()) {
                    keys.push(this.getCanvasFingerprint());
                }
                if (this.hasher) {
                    return this.hasher(keys.join('###'), 31);
                } else {
                    return this.murmurhash3_32_gc(keys.join('###'), 31);
                }
            },

            /**
             * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
             *
             * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
             * @see http://github.com/garycourt/murmurhash-js
             * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
             * @see http://sites.google.com/site/murmurhash/
             *
             * @param {string} key ASCII only
             * @param {number} seed Positive integer only
             * @return {number} 32-bit positive integer hash
             */

            murmurhash3_32_gc: function (key, seed) {
                var remainder, bytes, h1, h1b, c1, c2, k1, i;

                remainder = key.length & 3; // key.length % 4
                bytes = key.length - remainder;
                h1 = seed;
                c1 = 0xcc9e2d51;
                c2 = 0x1b873593;
                i = 0;

                while (i < bytes) {
                    k1 =
                        ((key.charCodeAt(i) & 0xff)) |
                        ((key.charCodeAt(++i) & 0xff) << 8) |
                        ((key.charCodeAt(++i) & 0xff) << 16) |
                        ((key.charCodeAt(++i) & 0xff) << 24);
                    ++i;

                    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                    k1 = (k1 << 15) | (k1 >>> 17);
                    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

                    h1 ^= k1;
                    h1 = (h1 << 13) | (h1 >>> 19);
                    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
                }

                k1 = 0;

                switch (remainder) {
                    case 3:
                        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                    case 2:
                        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                    case 1:
                        k1 ^= (key.charCodeAt(i) & 0xff);

                        k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                        k1 = (k1 << 15) | (k1 >>> 17);
                        k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                        h1 ^= k1;
                }

                h1 ^= key.length;

                h1 ^= h1 >>> 16;
                h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
                h1 ^= h1 >>> 13;
                h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
                h1 ^= h1 >>> 16;

                return h1 >>> 0;
            },

            // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
            hasLocalStorage: function () {
                try {
                    return !!window.localStorage;
                } catch (e) {
                    return true; // SecurityError when referencing it means it exists
                }
            },

            hasSessionStorage: function () {
                try {
                    return !!window.sessionStorage;
                } catch (e) {
                    return true; // SecurityError when referencing it means it exists
                }
            },

            isCanvasSupported: function () {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            },

            isIE: function () {
                if (navigator.appName === 'Microsoft Internet Explorer') {
                    return true;
                } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) {// IE 11
                    return true;
                }
                return false;
            },

            getPluginsString: function () {
                if (this.isIE() && this.ie_activex) {
                    return this.getIEPluginsString();
                } else {
                    return this.getRegularPluginsString();
                }
            },

            getRegularPluginsString: function () {
                return this.map(navigator.plugins, function (p) {
                    var mimeTypes = this.map(p, function (mt) {
                        return [mt.type, mt.suffixes].join('~');
                    }).join(',');
                    return [p.name, p.description, mimeTypes].join('::');
                }, this).join(';');
            },

            getIEPluginsString: function () {
                if (window.ActiveXObject) {
                    var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
                        'AcroPDF.PDF', // Adobe PDF reader 7+
                        'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                        'QuickTime.QuickTime', // QuickTime
                        // 5 versions of real players
                        'rmocx.RealPlayer G2 Control',
                        'rmocx.RealPlayer G2 Control.1',
                        'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                        'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                        'RealPlayer',
                        'SWCtl.SWCtl', // ShockWave player
                        'WMPlayer.OCX', // Windows media player
                        'AgControl.AgControl', // Silverlight
                        'Skype.Detection'];

                    // starting to detect plugins in IE
                    return this.map(names, function (name) {
                        try {
                            new ActiveXObject(name);
                            return name;
                        } catch (e) {
                            return null;
                        }
                    }).join(';');
                } else {
                    return ""; // behavior prior version 0.5.0, not breaking backwards compat.
                }
            },

            getScreenResolution: function () {
                var resolution;
                if (this.screen_orientation) {
                    resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
                } else {
                    resolution = [screen.height, screen.width];
                }
                return resolution;
            },

            getCanvasFingerprint: function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // https://www.browserleaks.com/canvas#how-does-it-work
                var txt = 'http://valve.github.io';
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = "#069";
                ctx.fillText(txt, 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText(txt, 4, 17);
                return canvas.toDataURL();
            }
        };
        return Fingerprint;
    })();
    //var _bowerId = '';
    var bowerId = (function () {
        var fp = new fingerprint();
        return fp.get();
    })();
    //----------浏览器指纹　结束　------------------------------


    //-------copy对象　开始-----------------------------------------------------------------
    var copy=function(source,destination){
        if(!destination) {
            destination = source;
            destination = copy(source, {});
        }
        else{
            for ( var key in source) {
                destination[key] = source[key];
            }
            return destination;
        }
    }
    //-------copy对象　结束-----------------------------------------------------------------

    function random(start,end){
        return _.random(start,end)
    }
    //{b:1,a:2,c:3} =>{a:2,b:1,c:3}
    function sort(obj) {
        if (_.isArray(obj)) return _.sortBy(obj);
        let o = {};
        var arr=_.sortBy(_.keys(obj));
        _.forEach(arr, function (value) {
            o[value] = obj[value];
        });
        return o
    }
    function indexOf(ary,value){
        return _.indexOf(ary,value);
    }
    function findIndex(ary,obj){
        return _.findIndex(ary,obj);
    }
    function find(ary,obj){
        return _.find(ary,obj);
    }

    return {
        toInt:toInt,
        toFloat:toFloat,
        isInt:isInt,
        isFloat:isFloat,
        trim:trim,
        mapShortDistance: getShortDistance,//短距离适用
        mapLongDistance: getLongDistance,//长距离适用
        format: format,
        formatObj:formatObj,
        formatIp:formatIp,
        formatMoney:formatMoney,
        random:random,
        sort:sort,
        findIndex:findIndex,
        indexOf:indexOf,
        find:find,
        date:date,
        dayTime:dayTime,
        setDay:setDay,
        copy:copy,
        ls: ls,
        cookie: cookie,
        bid: bowerId
    };
});