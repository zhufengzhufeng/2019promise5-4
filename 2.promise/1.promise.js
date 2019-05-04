// let Promise = require('./promise');
let promise = new Promise(function(resolve,reject){
    // throw new Error('错误'); // 执行时可能会发生异常 ，那就内部将错误异常作为原因，让promise变成失败态
    setTimeout(()=>{
        resolve('成功');
    },1000)
});
// 发布订阅模式
promise.then(function(value){
    console.log('success',value);
},function(reason){
    console.log('fail',reason);
});
promise.then(function(value){
    console.log('success',value);
},function(reason){
    console.log('fail',reason);
});
// 一个promise实例 可以then多次，分别绑定成功和失败，当触发resolve和reject的时候 触发对应的成功和失败