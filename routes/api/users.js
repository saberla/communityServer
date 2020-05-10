// login && register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const Users = require('../../Schemas/userSchema') // user数据库

// 注册 请求会带数据 POST请求
// api/user/register
// public
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
                    name: req.body.name,
                    nation: req.body.nation,
                    education: req.body.education
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

// 新增用户明细 POST请求
// passport 验证token
// private
// api/user/registerDetail
router.post('/registerDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
    // 判断该用户是否已存在
    Users.findOne({userName:req.body.userName})
      .then((user) => {
          if(user) {
              const newInside = {
                  gridNum: req.body.gridNum,
                  gridRange: req.body.gridRange,
                  gridPeople: req.body.gridPeople,
                  userName: req.body.userName,
                  name: req.body.name,
                  tel: req.body.tel,
                  education: req.body.education,
                  nation: req.body.nation,
                  taskAmount: req.body.taskAmount,
                  quality: req.body.quality
              }
              user.insideData.unshift(newInside)
              user.save()
                .then(user => res.json({data:{code:200, msg:'创建网格成功', user}}))
          } else {
              return res.json({data:{code:400, msg:'该用户不存在'}})
          }
      })
  })

// 登录 请求会带数据 POST请求
// 返回token, jwt passport
//public
// api/user/login
router.post('/login', (req, res) => {
    let userName = req.body.userName,
        password = req.body.password
    Users.findOne({userName})
        .then((user) => {
            if(!user) {
                return res.json({data:{code:404,msg:'用户不存在'}})
            }
            // 当前时间
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let h = date.getHours()
            let m = date.getMinutes()
            let nowDate = year + '.' + month + '.' + day + ' ' + h + ':' + m
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
                            tel: user.tel,
                            nation: user.nation,
                            education: user.education,
                            nowDate: nowDate
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
// private
// api/user/getUsers
router.post('/getUsers',passport.authenticate('jwt', {session:false}) , (req, res) => {
    let query = req.body.query
    let currentPage = req.body.currentPage
    let pageSize = req.body.pageSize
    Users.countDocuments(query, (err, count) => {
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
// private
// api/user/getLoginUser
router.post('/getLoginUser', (req, res) => {
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
// private
// api/user/updateUser
router.post('/updateUser', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.updateOne({userName: req.body.userName1}, {
        name: req.body.name,
        tel: req.body.tel,
        role: req.body.role,
        nation: req.body.nation,
        education: req.body.education
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

// 修改用户明细 POST请求
// passport 验证token
// private
// api/user/updateUserDetail
router.post('/updateUserDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOne({userName:req.body.userName})
      .then((user) => {
          if(user) {
              user.insideData.forEach((el,index) => {
                  if (el.gridNum === req.body.gridNum) {
                      el.gridPeople = req.body.gridPeople
                  }
              })
              user.save()
                .then(user => res.json({data:{code:200, msg:'修改成功', user}}))
          }
      })
  })

// 个人姓名修改 POST请求
// passport 验证token
// private
// api/user/updateName
router.post('/updateName', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOneAndUpdate({userName: req.body.userName}, {
        name: req.body.name
    },{new: true, useFindAndModify:false})
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
// private
// api/user/updatePass
router.post('/updatePass', passport.authenticate('jwt', {session:false}), (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) throw err
            Users.updateOne({userName: req.body.userName}, {
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


// 密码重置 POST请求
// passport 验证token
// private
// api/user/resetPassword
router.post('/resetPassword', passport.authenticate('jwt', {session:false}), (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) throw err
            Users.updateOne({userName: req.body.userName}, {
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
// private
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

// 删除用户明细 POST请求
// passport 验证token
// private
// api/user/deleteUserDetail
router.post('/deleteUserDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOne({userName:req.body.userName})
      .then((user) => {
          if(user) {
              let tempIndex = 0
              let count = 0
              let start = 0
              user.insideData.forEach((el,index) => {
                if (req.body.gridNum) {
                    if (el.gridNum === req.body.gridNum) {
                        tempIndex = index
                        user.insideData.splice(tempIndex, 1)
                    }
                }
              })
              for (let i=0;i<user.insideData.length;i++) {
                  if (req.body.name) {
                    if (user.insideData[i].name === req.body.name) {
                        count++
                        if (count === 1) {
                            start = i
                        }
                    }
                  }
              }
              user.insideData.splice(start, count)
              user.save()
                .then(user => res.json({data:{code:200, msg:'删除成功', user}}))
          }
      })
  })


module.exports = router