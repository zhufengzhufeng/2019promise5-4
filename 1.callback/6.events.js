let fs = require('fs');
// “发布“ -> 中间代理 <- “订阅“
// 观察者模式 观察者和被观察者，如果被观察者数据变化了 通知观察者  发布订阅
function Events(){ // redux promise 
    this.callbacks = [];
    this.results = [];
}
Events.prototype.on = function(callback){ // 订阅
    this.callbacks.push(callback);
}
Events.prototype.emit = function(data){ // 发布
    this.results.push(data);
    this.callbacks.forEach(c=>c(this.results));
}
let e = new Events();
e.on(function(arr){
    if(arr.length === 3){
        console.log(arr);
    }
})
fs.readFile('./name.txt','utf8',function(err,data){ // 5s
    e.emit(data)
});
fs.readFile('./age.txt','utf8',function(err,data){ // 3s
    e.emit(data)
});
fs.readFile('./age.txt','utf8',function(err,data){ // 3s
    e.emit(data)
});
