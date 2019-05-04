// 判断类型 Object.prototype.toString.call();
function isType(type){ // type  == 'boolean'
  return function (obj){
    return Object.prototype.toString.call(obj).includes(type);
  }
}
// 包装成一个高阶函数 批量生成函数  
let types = ['String','Object','Array','Null','Undefined','Boolean'];
let fns = {};
types.forEach(type=>{ // 批量生成方法
    fns['is'+type] = isType(type)
})
let a = true;
console.log(fns.isString(a)); // 函数柯里化 // 偏函数
// 高阶函数
// lodash after 