const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()

// mongodb数据库连接及端口配置
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`server running on ${port}`)
})

mongoose.connect('mongodb://localhost:27017/community', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Mongodb Connected'))
.catch(err => console.log(err))

//CORS设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

// use bodyParser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//passport 初始化
app.use(passport.initialize())
require('./config/passport')(passport)

// 引入users.js
const users = require('./routes/api/users')

// 使用引用过来的routes
app.use('/api/user', users)

