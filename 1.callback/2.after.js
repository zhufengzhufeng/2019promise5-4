// after 在多少次之后执行
function after(times,callback){
    let total =0;
    return function(a){
        total+=a
        if(--times == 0){
            callback(total);
        }
    }
}
let fn = after(3,function(total){ // 当达到预计的次数 执行某个函数
    console.log('after',total);
});
// 解决异步问题
fn(1);
fn(2);
fn(3);