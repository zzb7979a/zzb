const express = require('express')//实例引用，先用npm install express安装express包

const app = express()//执行express函数，实例化app
//允许express处理传递过来的json数据
app.use(express.json())

const mongoose = require('mongoose')//引用数据库
mongoose.connect('mongodb://localhost:27017/express-test')//连接数据库建立express-test数据库表
const Product=mongoose.model('Product',new mongoose.Schema({
    title:String,
}))//建立product一个模型model，传递一个表结构shema
// Product.insertMany([//插入数据
//     {title:'产品1'},
//     {title:'产品2'},
//     {title:'产品3'},
// ])

app.use(require('cors')())//跨域请求，要先安装live server插件，再安装cors包，要写在路由前面。


app.use('/',express.static('public'))//使用静态文件托管中间件，先建一个public目录在里面再建立一个静态文件index.htmlindex.html
//在路由里面加static可以定义文件的访问路径
//关于的接口
app.get('/about', function(req,res){
    res.send(
        {page:'About us'}
    )
})
//产品接口
app.get('/products',async function(req,res){//async代表异步和下面的await必须一起出现
  // const data=await Product.find().skip(1).limit(2)//skip表示跳行，limit表示限制几行
 // const data=await Product.find().where({//where代表查询
 //     title:'产品2'})
  
const data = await Product.find().sort({_id:-1})//sort排序-1代表倒序


    res.send(data)
})
//产品详情接口
app.get('/products/:id',async function(req,res){
    const data = await Product.findById(req.params.id)
    res.send(data)
})
//post 可以传递更多的数据，下载rest client,再新建test.http文件在里面新建GIT函数后面跟上要调试的接口地址
//向数据库里面添加数据
app.post('/products',async function(req,res){
    const data =req.body//获取客户端发送过来的数据
    const product =await Product.create(data)//把数据插入进数据库
    res.send(product)
})   
 //修改数据库里面数据，先通过一个条件进入数据库找到对象进行修改，在返回对象数据，再保存修改数据 
 //进入数据库都要使用await.

// app.put('/products/:id',async function(req,res){
//     const product = await Product.findById(req.params.id)
//     product.title=req.body.title
//     await product.save()
//     res.send(product)

//})
//使用patch方法修改数据库数据
app.patch('/products/:id',async function(req,res){
    const product = await Product.findById(req.params.id)
    product.title=req.body.title
    await product.save()
    res.send(product)

})

app.delete('/products/:id',async function(req,res){
    const product = await Product.findById(req.params.id)
    await product.remove()
    res.send({
        success:true
    })
})

//服务监听。
app.listen(3002,()=>{
    console.log('App listening on poot 3002!');
});
