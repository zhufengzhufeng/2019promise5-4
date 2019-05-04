let  resolvePromise = (promise2,x,resolve,reject) => {
    if(promise2 === x){
        return reject(new TypeError('循环引用'))
    }
    if(typeof x === 'function' || (typeof x === 'object' && x !== null)){
        let called;
        try{
            let then = x.then; 
            if(typeof then === 'function'){ 
                then.call(x,y=>{ 
                    if(called) return; 
                    called = true;
                    resolvePromise(promise2,y,resolve,reject);
                },r=>{
                    if(called) return;
                    called = true;
                    reject(r);
                })
            }else{
                resolve(x);
            }
        }catch(e){
            if(called) return;
            called = true;
            reject(e);
        }
    }else{
        resolve(x);
    }
}

class Promise{
    constructor(executor){
        this.status = 'pending'; 
        this.value; 
        this.reason;
        this.resolveCallbacks = []; 
        this.rejectCallbacks = [];
        let resolve = (value)=>{
            if(value instanceof Promise){
                return value.then(resolve,reject);
            }
            if(this.status == 'pending'){
                this.status = 'fulfilled';
                this.value = value;
                this.resolveCallbacks.forEach(fn=>fn());
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
        onfulfilled = typeof onfulfilled === 'function'?onfulfilled:val=>val;
        onrejected = typeof onrejected === 'function'?onrejected:r=>{throw r}
        let promise2;
        promise2 = new Promise((resolve,reject)=>{
            if(this.status === 'fulfilled'){
                setTimeout(()=>{ 
                    try{
                        let x = onfulfilled(this.value);
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
    catch(rejectFunc){
        return this.then(null,rejectFunc); 
    }
}
Promise.defer = Promise.deferred = function(){
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
Promise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value);
    })
}
Promise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason);
    })
}
module.exports = Promise; 