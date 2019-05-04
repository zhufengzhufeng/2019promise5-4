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
        if(this.status === 'fulfilled'){
            onfulfilled(this.value);
        }
        if(this.status === 'rejected'){
            onrejected(this.reason);
        }
        if(this.status === 'pending'){
            // ... 先把成功的回调和失败的回调分开存放
            this.resolveCallbacks.push(()=>{
                onfulfilled(this.value)
            });
            this.rejectCallbacks.push(()=>{
                onrejected(this.reason);
            })
        }
    }
}
module.exports = Promise;