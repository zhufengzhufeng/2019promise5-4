
// 被观察者  我家小宝宝 心情好不好 心情好 -》 心情不好
class Subject {
    constructor(name){
        this.name = name;
        this.observers = []; //观察者 要存放到被观察者中
        this.state = '心情很美丽'
    }
    // 被观察者要提供一个接受观察者的方法
    attach(observer){
        this.observers.push(observer); // 存放所有的观察者
    }
    setState(newState){ // 更改被观察者的状态
        this.state = newState;
        this.observers.forEach(o=>o.update(newState));
    }
} 
class Observer{
    constructor(name){
        this.name = name;
    }
    update(newState){ // 用来通知所有的观察者状态更新了
        console.log(this.name+'说：宝宝'+newState);
    }
}
let sub = new Subject('小宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');
sub.attach(o1);
sub.attach(o2);
sub.setState('心情不好了');
sub.setState('心情不好了1')


// 1) 异步的缺陷
//  回调可能会导致代码不好维护 导致恶魔金子塔 回调地狱
//  错误问题 不好捕获错误 不能使用try-catch
//  同步“异步请求“需要自己维护计数器 
//  代码不优雅

// promise 
