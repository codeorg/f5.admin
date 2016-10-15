
//中间不要加注释，不然grunt编译出错
require.config({
    "baseUrl":"/js",
    "paths": {"angular" : "lib/angular",
        "jquery"        : "lib/jquery-1.11.1",
        "lodash"        : "lib/lodash",
        //"socket.io"        : "lib/socket.io",
        "zh-cn"         : "lib/angular-locale_zh-cn",
        "ui.router"     : "lib/angular-ui-router",
        "ngResource"    : "lib/angular-resource",
        "ngSanitize"    : "lib/angular-sanitize",
        "ngScrollSpy"   : "lib/ng/ngScrollSpy",
        "angular-loading-bar":"lib/loading-bar",
        "ui.bootstrap"  : "lib/ui-bootstrap-tpls-0.12.0",
        "dateFormat"       : "lib/dateFormat",
        "utility"       : "lib/utility",
        "service"       : "lib/service",
        "xeditable"     : "lib/xeditable",
        "bootstrap"     : "lib/bootstrap",
        "router"       : "router"
    },
    "map": {
        "*": {
            "css": "css.min"
        }
    },
    "shim": {
        "angular"       : {
            "deps"      : ["jquery"],
            "exports"   : "angular"
        },
        "ui.router"     : ["angular"],
        "ngResource"    : ["angular"],
        "ngSanitize"    : ["angular"],
        "zh-cn"         : ["angular"],
        "ngScrollSpy"   : ["angular"],
        "bootstrap"       : ["jquery"],
        "utility"       : ["lodash"],
        "ui.bootstrap"  : ["angular"],
        "angular-loading-bar" : ["angular","css!/css/lib/loading-bar.css"],
        "xeditable" : ["angular","css!/css/xeditable.css"]
    },
    "deps":["app"],
    "urlArgs": "bust=1.0.1"
});

