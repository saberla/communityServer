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


// 创建api
// 引入users.js并使用接口
const users = require('./routes/api/users')
app.use('/api/user', users)
// 引入logRecord.js并使用
const logRecords = require('./routes/api/logRecord')
app.use('/api/records', logRecords)
// 引入opRecord.js并使用
const opRecords = require('./routes/api/opRecord')
app.use('/api/opRecords', opRecords)
// 引入sysRecord.js并使用
const sysRecords = require('./routes/api/sysRecord')
app.use('/api/sysRecords', sysRecords)
// 引入dictionary.js并使用
const dictionary = require('./routes/api/dictionary')
app.use('/api/dictionary', dictionary)
// 引入xinduStreet.js并使用
const street = require('./routes/api/xinduStreet')
app.use('/api/Streets', street)
// 引入community.js并使用
const community = require('./routes/api/community')
app.use('/api/community', community)
// 引入house.js 并使用
const house = require('./routes/api/house')
app.use('/api/house', house)
// 引入person.js并使用
const person = require('./routes/api/person')
app.use('/api/persons', person)
// 引入car.js并使用
const car = require('./routes/api/car')
app.use('/api/cars', car)
// 引入task.js并使用
const task = require('./routes/api/task')
app.use('/api/task', task)
