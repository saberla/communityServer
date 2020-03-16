// login && register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const Users = require('../../Schemas/userSchema') // user数据库

// 注册 请求会带数据 POST请求
// api/user/register
router.post('/register', (req, res) => {
    // 判断账号是否已经注册
    Users.findOne({userName:req.body.userName})
        .then((user) => {
            if(user) {
                return res.json({data:{code:400, msg:'该账号已注册'}})
            } else {
                const NewUser = new Users({
                    userName: req.body.userName,
                    password: req.body.password,
                    role: req.body.role,
                    tel: req.body.tel,
                    name: req.body.name
                })
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(NewUser.password, salt, function(err, hash) {
                        if (err) throw err
                        NewUser.password = hash
                        NewUser.save()
                                .then(user => res.json({data:{code:200, msg:'注册成功'}}))
                                .catch(err => console.log(err))
                    })
                });
            }
        })
})

// 登录 请求会带数据 POST请求
// 返回token, jwt passport
// api/user/login
router.post('/login', (req, res) => {
    let userName = req.body.userName,
        password = req.body.password
    Users.findOne({userName})
        .then((user) => {
            if(!user) {
                return res.json({data:{code:404,msg:'用户不存在'}})
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // jwt.sign('规则', '加密名字', '过期时间', '回调函数')
                        let rule = {
                            id: user.id,
                            userName: user.userName,
                            password: user.password,
                            date: user.date,
                            role: user.role,
                            name: user.name,
                            tel: user.tel
                        }
                        jwt.sign(rule, 'secret', {expiresIn: 60*60*24}, (err, token) => {
                            if (err) throw err
                            return res.json({data: {code: 200, msg: '登陆成功', token: 'Bearer ' + token}})
                        })
                    } else {
                        return res.json({data: {code: 400, msg:'密码错误'}})
                    }
                })
        })
})

// 返回用户数据 POST请求
// passport 验证tocken
// api/user/getUsers
router.post('/getUsers',passport.authenticate('jwt', {session:false}) , (req, res) => {
    let query = req.body.query
    let currentPage = req.body.currentPage
    let pageSize = req.body.pageSize
    Users.countDocuments({}, (err, count) => {
        if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
        else {
            Users.find(query).skip((currentPage-1) * pageSize).limit(pageSize)
            .then(user => {
                res.json({data:{
                    code: 200,
                    user,
                    totalCount: count
                }})
            })
        }
    })
})

// 返回目前登录用户数据 POST请求
// passport 验证token
// api/user/getLoginUser
router.post('/getLoginUser', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.find({userName: req.body.userName})
        .then(user => {
            res.json({data:{
                code: 200,
                user
            }})
        })
    .catch(err => {
        console.log(err)
    })
})

// 修改用户数据 POST请求
// passport 验证token
// api/user/updateUser
router.post('/updateUser', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.update({userName: req.body.userName1}, {
        userName: req.body.userName,
        name: req.body.name,
        tel: req.body.tel,
        role: req.body.role
    })
    .then(user => {
        res.json({data:{
            code:200,
            msg: '修改成功'
        }})
    })
    .catch(err => {
        console.log(err)
    })
})

// 个人姓名修改 POST请求
// passport 验证token
// api/user/updateName
router.post('/updateName', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOneAndUpdate({userName: req.body.userName}, {
        name: req.body.name
    },{new: true})
    .then(user => {
        res.json({data:{
            code:200,
            msg: '修改成功',
            user
        }})
    })
    .catch(err => {
        console.log(err)
    })
})

// 个人密码修改 POST请求
// passport 验证token
// api/user/updatePass
router.post('/updatePass', passport.authenticate('jwt', {session:false}), (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) throw err
            Users.update({userName: req.body.userName}, {
                password: hash
            })
            .then(user => {
                res.json({data:{
                    code:200,
                    msg: '修改成功'
                }})
            })
            .catch(err => {
                console.log(err)
            })
        })
    });
})


// 密码资料重置 POST请求
// passport 验证token
// api/user/resetPassword
router.post('/resetPassword', passport.authenticate('jwt', {session:false}), (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) throw err
            Users.update({userName: req.body.userName}, {
                password: hash
            })
            .then(user => {
                res.json({data:{
                    code:200,
                    msg: '修改成功'
                }})
            })
            .catch(err => {
                console.log(err)
            })
        })
    });
})

// 删除用户数据 POST请求
// passport 验证tocken
// api/user/deleteUser
router.post('/deleteUser', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.deleteOne({userName: req.body.userName})
    .then(user => {
        res.json({data:{
            code:200,
            msg: '移除成功'
        }})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router