
let fs = require('fs');
let Promise = require('./promise');
let p1 = new Promise((resolve,reject)=>{
    reject(1000);
});

// catch方法的实现  catch 是没有成功的then方法
p1.catch(e=>{
    console.log(e);
});
Promise.reject(123).catch(r=>{
    console.log(r);
});

// all race 

// angular Q 延迟对象
// function read(url){
//     let dfd = Promise.defer();
//     fs.readFile(url,'utf8',(err,data)=>{
//         if(err) dfd.reject(err);
//         dfd.resolve(data);
//     });
//     return dfd.promise;
// }
// read('name.txt').then(y=>{
//     console.log(y);
// });

// 作业:finally用法 成功和失败都执行的方法