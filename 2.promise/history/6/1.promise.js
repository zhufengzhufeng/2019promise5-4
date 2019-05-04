// let Promise = require('./promise');
// promisify promise化
let fs = require('mz/fs');
// node 中已经借鉴了 所有的异步方法参数第一个都是err
// function promisify(fn){
//     return function(){
//         return new Promise((resolve,reject)=>{
//             fn(...arguments,function(err,data){
//                 if(err)reject(err);
//                 resolve(data);
//             })
//         })
//     }
// }
// mz 它里面把所有的node模块 都进行了包装promise
// let read = promisify(fs.writeFile);
// all的原理
Promise.all = function(values){
    return new Promise((resolve,reject)=>{
        let results = []; // 结果数组
        let i = 0;
        let processData = (value,index)=>{
            results[index] = value;
            // 当成功的个数 和 当前的参数个数相等就把结果抛出去
            if(++i === values.length){
                resolve(results);
            }
        }
        for(let i = 0 ; i< values.length;i++){
            let current = values[i]; // 拿到数组中每一项
            // 判断是不是一个promise
            if((typeof current === 'object' &&  current !==null)|| typeof current == 'function'){
                // 如果是promise
                if(typeof current.then == 'function'){
                    // 就调用这个promise的then方法，把结果和索引对应上,如果任何一个失败了返回的proimise就是一个失败的promise
                    current.then(y=>{
                        processData(y,i);
                    },reject);
                }else{
                    processData(current,i);
                }
            }else{
                processData(current,i);
            }
        }
    });
}
// race的原理
Promise.race = function(values){
    return new Promise((resolve,reject)=>{
        for(let i = 0 ; i< values.length;i++){
            let current = values[i]; 
            if((typeof current === 'object' &&  current !==null)|| typeof current == 'function'){
                let then = current.then;
                if(typeof then == 'function'){ // 比较哪个promise比较快，谁快用快
                    then.call(current,resolve,reject)
                }else{
                    resolve(current);
                }
            }else{
                resolve(current);
            }
        }
    });
}
Promise.race([fs.readFile('name1.txt','utf8'),fs.readFile('age.txt2','utf8')]).then(values=>{
    console.log(values);
},r=>{
    console.log(r);
})
