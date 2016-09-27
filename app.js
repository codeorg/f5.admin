/**
 * Created by Codeorg.com on 2016/9/26.
 */
"use strict";
let env = process.env.NODE_ENV || 'production';
env="dev";
let root=(env=="production")?"dist":"src";
let port=5000;
let Koa = require('koa');
var send = require('koa-send');
const app = new Koa();

app.use(async (ctx, next)=>{
    if(/([\.]+)/gi.test(ctx.path)){
        await send(ctx, "/"+root+ctx.path);
    }else{
        await send(ctx, "/"+root+"/index.html");
    }
});

app.listen(port);
console.log("服务启动端口："+port)




