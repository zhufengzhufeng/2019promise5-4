
let fs = require('fs');
let Promise = require('./promise');
function read(url){
    return new Promise((resolve,reject)=>{
        fs.readFile(url,'utf8',(err,data)=>{
            if(err)reject(err);
            resolve(data);
        })
    })
}
// 1) 循环引用 保证返回的promise不是当前then返回的promise 否则就变成了自己等待自己完成
let p1 = new Promise((resolve,reject)=>{
    resolve(100);
})
let promise2 = p1.then(()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(new Promise((resolve,reject)=>{
               setTimeout(()=>{
                    resolve(10000)
               },1000)
            }));
        },1000)
    })
});
promise2.then((data)=>{
    console.log(data);
},err=>{
    console.log('err',err);
})