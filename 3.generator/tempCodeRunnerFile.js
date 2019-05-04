let fs = require('mz/fs');
async function read(){
        let filename = await fs.readFile('./name1.txt','utf8');
        let age = await fs.readFile(filename,'utf8');
        let b = await [1,2,3];
        return age+b;
}   
read().then(data=>{
    console.log('s',data);
},err=>{
    console.log(err);
})