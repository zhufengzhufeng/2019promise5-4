function resolvePromise(promise2,x,resolve,reject){
    // 判断x的类型 来处理promise2是成功还是失败
    console.log(promise2);
}

class Promise{
    constructor(executor){
        this.status = 'pending'; 
        this.value; 
        this.reason;
        this.resolveCallbacks = []; // 当then是pending 我希望吧成功的方法都放到数组中
        this.rejectCallbacks = [];
        let resolve = (value)=>{
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
    then(onfulfilled,onrejected){ 
        let promise2;
        //调用then后必须返回一个新的promise
        promise2 = new Promise((resolve,reject)=>{
            if(this.status === 'fulfilled'){
                setTimeout(()=>{ // 为了保证promise2存在
                    try{
                        // 需要对then的成功的回调和失败的回调取到他的返回结果，如果是普通值就让promise2成功即可
                        let x = onfulfilled(this.value);
                        // 对x的类型做判断，常量可以直接抛出来 但是如果是promise需要采取当前promise的状态
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
                // ... 先把成功的回调和失败的回调分开存放
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
        return promise2
    }
}
module.exports = Promise;