// Promise 是一个类 new Promise 天生自带的
// Promise 含义：承诺  promise中有三个状态 成功态  失败态  （等待态） pending, fulfilled, or rejected.
// promise中会存放两个变量 分别value 和 reason
// promise的实例上 会有then方法

// 当创建一个promise的时候 需要提供一个执行器函数 此函数会立即执行
// 默认是等待态 可以转化成成功或者失败,状态更改后不能修改状态
let Promise = require('./promise');
let promise = new Promise(function(resolve,reject){
    resolve(123);
    reject(456);
});
promise.then(function(value){
    console.log('success',value);
},function(reason){
    console.log('fail',reason);
});

// 1)  promise