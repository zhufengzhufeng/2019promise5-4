let  resolvePromise = (promise2,x,resolve,reject) => {
    // 判断x的类型 来处理promise2是成功还是失败
    // 所有的promise都遵循这个规范，不同的人写的promise可能会混用
    // 尽可能考虑的周全 要考虑别人promise可能出错的情况
    if(promise2 === x){
        return reject(new TypeError('循环引用'))
    }
    // 判断x是不是一个promise  ,这个x 可能不是自己的promise 所以为了安全 需要在进行校验，放置调一起用成功和失败 
    if(typeof x === 'function' || (typeof x === 'object' && x !== null)){
        // 尝试取当前x的then方法, 这个then方法可能别人定义的时候 用的Object.defineProperty 
        let called;
        try{
            let then = x.then; // 如果取then方法出错 那就用错误拒绝promise2
            if(typeof then === 'function'){ // 我就认为他是一个promise
                then.call(x,y=>{ // 让当前的promise执行 ，不用多次取then方法了
                    // y 有可能还是一个promise , 继续调用resolvePromise方法，直到解析出一个常量为止，最终把常量传递下去
                    if(called) return; // 放置此方法多次被调用
                    called = true;
                    resolvePromise(promise2,y,resolve,reject);
                },r=>{
                    if(called) return;
                    called = true;
                    reject(r); // 让当前的promise变成失败态即可
                })
            }else{
                // x就是一个普通的对象 并没有then方法
                resolve(x);
            }
        }catch(e){
            if(called) return;
            called = true;
            reject(e);
        }
    }else{
        // x肯定一个常量
        resolve(x);
    }
}

class Promise{
    constructor(executor){
        this.status = 'pending'; 
        this.value; 
        this.reason;
        this.resolveCallbacks = []; // 当then是pending 我希望吧成功的方法都放到数组中
        this.rejectCallbacks = [];
        let resolve = (value)=>{
            // 如果是promise就调用这个promise的then方法 
            if(value instanceof Promise){
                // 不停的解析 等待着解析出一个常量 传递给下面
                return value.then(resolve,reject);
            }
            if(this.status == 'pending'){
                this.status = 'fulfilled';
                this.value = value;
                this.resolveCallbacks.forEach(fn=>fn()); // 发布
            }
        }
        let reject = (reason)=>{
            if(this.status === 'pending'){
                this.status = 'rejected';
                this.reason = reason;
                this.rejectCallbacks.forEach(fn=>fn())
            }
        }
        try{
            executor(resolve,reject);
        }catch(e){
            reject(e);
        }
    }
    then(onfulfilled,onrejected){ // onfulfilled,onrejected 是两个可选参数 
        onfulfilled = typeof onfulfilled === 'function'?onfulfilled:val=>val;
        onrejected = typeof onrejected === 'function'?onrejected:r=>{throw r}
        let promise2;
        promise2 = new Promise((resolve,reject)=>{
            if(this.status === 'fulfilled'){
                setTimeout(()=>{ 
                    try{
                        let x = onfulfilled(this.value);
                        // x是普通值还是promise 如果是普通值 直接调用promise2的resolve
                        // 如果是promise  那应该让x这个promise执行 x.then
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                },0);
            }
            if(this.status === 'rejected'){
                setTimeout(()=>{
                    try{
                        let x = onrejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                },0)
            }
            if(this.status === 'pending'){
                this.resolveCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onfulfilled(this.value);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    },0)
                });
                this.rejectCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onrejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    },0)
                })
            }
        });
        return promise2;
    }
    catch(rejectFunc){// catch的实现 
        return this.then(null,rejectFunc); 
    }
}
// 暴露一个方法这个方法需要返回一个对象 对象上需要有 promise resolve reject 三个属性
// 减少嵌套
Promise.defer = Promise.deferred = function(){
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
// 产生成功的promise
Promise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value);
    })
}
// 产生一个失败的promise
Promise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason);
    })
}
module.exports = Promise; 
// 全局安装测试工具 sudo npm install promises-aplus-tests -g
//  promises-aplus-tests 文件名