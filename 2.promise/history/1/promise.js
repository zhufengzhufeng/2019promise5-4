class Promise{
    constructor(executor){
        this.status = 'pending'; // 默认当前状态是等待态
        this.value; // 为什么成功
        this.reason;// 为什么失败
        // 表示成功的函数
        let resolve = (value)=>{
            // 只有是等待态的时候 才能更改状态
            if(this.status == 'pending'){
                this.status = 'fulfilled';
                this.value = value;
            }
        }
        // 表示失败的函数
        let reject = (reason)=>{
            if(this.status === 'pending'){
                this.status = 'rejected';
                this.reason = reason;
            }
        }
        // 默认会调用执行函数
        executor(resolve,reject);
    }
    then(onfulfilled,onrejected){ // 成功的回调和失败的回调
        // 如果状态是成功的时候
        if(this.status === 'fulfilled'){
            onfulfilled(this.value);
        }
        if(this.status === 'rejected'){
            onrejected(this.reason);
        }
    }
}

module.exports = Promise;