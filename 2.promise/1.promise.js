
let fs = require('fs');
let Promise = require('./promise');
let p1 = new Promise((resolve,reject)=>{
    reject(100);
})

p1.then().then().then(y=>{
    console.log(y);
},r=>{
    console.log('err',r);
})