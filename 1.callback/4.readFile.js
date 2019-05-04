// node版本要求 7.6 以上
let fs = require('fs');
// 1) 异步不能使用try catch
// 2) 同步“异步的返回结果”  异步“并行“ paralle “串行” series
// fs.readFile 
let arr = []; // 保证顺序统一
let i = 0;
function fn(data,index){
    arr[index] = data;
    if(++i == 2){
        console.log(arr);
    }
}
fs.readFile('./name.txt','utf8',function(err,data){ // 5s
    fn(data,1); // 每个异步函数执行完后 调用一个回调通知完成了，将结果传入
});
fs.readFile('./age.txt','utf8',function(err,data){ // 3s
    fn(data,0);
});