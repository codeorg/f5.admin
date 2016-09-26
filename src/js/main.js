
//中间不要加注释，不然grunt编译出错
require.config({
    "baseUrl":"/js",
    "paths": {"angular" : "lib/angular",
        "jquery"        : "lib/jquery-1.11.1",
        "socket.io"        : "lib/socket.io",
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
        "ngScrollSpy"   : ["angular"],
        //"utility"       : ["dateFormat"],
        "angular-loading-bar" : ["angular","css!/css/lib/loading-bar.css"],
        "xeditable" : ["angular","css!/css/xeditable.css"]
    },
    "deps":["app"],
    "urlArgs": "bust=1.0.0"
});

