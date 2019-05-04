let fs = require('fs');
function after(times,callback){ // 使用after函数 可以简化异步操作
    let arr = [];
    return function(err,r){
        if(err){
            throw new Error(err);
        }
        arr.push(r); // 把结果传递到对应的callback中
        if(--times === 0){
            callback(arr);
        }
    }
}
let newFn = after(3,function(arr){
    console.log(arr); // 当异步完成后触发此方法
});
fs.readFile('./name1.txt','utf8',function(err,data){ // 5s
    newFn(err,data);  // 错误优先 第一个参数永远是错误
});
fs.readFile('./age.txt','utf8',function(err,data){ // 3s
    newFn(err,data);
});
fs.readFile('./age.txt','utf8',function(err,data){ // 3s
    newFn(err,data);
});
// compose
// 发布订阅模式 redux promise