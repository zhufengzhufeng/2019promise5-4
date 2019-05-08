// generator es6语法
// koa1.0在使用的 koa1废弃掉了 async + await

// 生成器 -> 迭代器的
// 可以暂停执行 * 表示是一个生成器函数 yield 产出

// function * read(){
//     yield 1;
//     yield 2;
//     yield 3;
//     return 100
// }
// let it = read(); // generator 返回的是生成器 生成器有一个next方法，调用这个方法 会返回一个对象 对象done:是否迭代完成 value 产出的结果
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

// function arg(){ // Symbol.iterator可以被迭代的方法 
//     let arr = [...{0:1,1:2,2:3,3:4,length:4,
//         [Symbol.iterator]:function * (){
//             let index = 0;
//             while(index != this.length){
//                 yield this[index++];
//             }
//         }
//         // [Symbol.iterator]:function(){
//         //     let index = 0;
//         //     return {
//         //         next:()=>{
//         //             return {done:this.length == index,value:this[index++]}
//         //         }
//         //     }
//         // }
//     }]
//     console.log(arr);
// }
// arg(1,2,3)



// function * read(){
//     let a = yield 1;
//     console.log(a);
//     let b = yield 2;
//     console.log(b);
//     let c = yield 3;
//     console.log(c);
// }
// let it = read('a');
// it.next(); // 第一次调用next时 传参没有任何意义
// it.next('100'); // 这次执行时会打印a的值，a的值是需要调用next方法传递进去的
// it.next('200'); 
// it.next('300'); 

let fs = require('mz/fs');
function * read(){
    let filename = yield fs.readFile('./name.txt','utf8');
    let age = yield fs.readFile(filename,'utf8');
    let b = yield [1,2,3];
    return age+b;
}   
// let co = require('co');
function co(it){// express koa
    return new Promise((resolve,reject)=>{
        function next(r){ //如果碰到异步迭代 需要借助一个自执行函数来实现，保证第一次执行后调用下一次执行
            let {value,done} = it.next(r);
            if(!done){ // babel
                Promise.resolve(value).then((r)=>{
                    next(r);
                });
            }else{
                resolve(value);
            }
        }
        next();
    });
}
co(read()).then(data=>{
    console.log(data);
});


// 终极解决方案
let fs = require('mz/fs');

// async + await = > generator + co语法糖
async function read(){ // 一般情况下 就使用trycatch 不要是promise的catch了
    let filename = await fs.readFile('./name1.txt','utf8');
    let age = await fs.readFile(filename,'utf8');
    let b = await [1,2,3];
    return age+b;
}   
read().then(data=>{
    console.log('s',data);
},err=>{
    console.log(err);
})
// let it = read();
// let {value,done} = it.next();
// value.then(data=>{
//     let {value,done} = it.next(data);
//     value.then(function(data){
//         console.log(data)
//     })
// })

// koa源码
// 1) 作业 实现finally方法 
// 2) 把 promise流程整个自己写一遍
// 3) 出几道考试题 答下题

// 下次 周三上课 2个晚上的时间 过一下es6 es6用法 map set symbol.. reduce compose
// 周日开始node 核心应用 