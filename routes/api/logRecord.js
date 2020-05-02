// 记录登录日志
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Records = require('../../Schemas/logRecordShema') // 记录库
const Houses = require('../../Schemas/houseSchema') //房屋库
const Communities = require('../../Schemas/communitySchema') // 小区库
const Persons = require('../../Schemas/personSchema') //人员库
const Users = require('../../Schemas/userSchema') // user数据库
const Cars = require('../../Schemas/carSchema') //车辆库

// 写入登录记录 请求会带数据 POST请求
// api/records/writeRecords
router.post('/writeRecords', (req, res) => {
  const newRecord = new Records({
    userName: req.body.userName,
    role: req.body.role,
    tel: req.body.tel,
    name: req.body.name,
    nation: req.body.nation,
    education: req.body.education,
    nowDate: req.body.nowDate
  })
  newRecord.save()
    .then(user => res.json({data:{code:200, msg:'写入登录记录成功'}}))
    .catch(err => {console.log(err)})
})

// 返回目前登录日志 POST请求
// passport 验证token
// api/records/getRecords
router.post('/getRecords', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  Records.countDocuments({}, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      Records.find({}).skip((currentPage-1) * pageSize).limit(pageSize)
        .then(user => {
            res.json({data:{
                code: 200,
                user,
                totalCount: count
            }})
        })
        .catch(err => {
            console.log(err)
        })
    }
  })
})

// 返回echarts图表信息 POST请求
// passport 验证tocken
// private
// api/records/getTotals
router.post('/getTotals',passport.authenticate('jwt', {session:false}) , (req, res) => {
    let  arr = []
  Houses.countDocuments({}, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        let obj = {}
        obj.name = '房屋总数'
        obj.value = count
        arr.push(obj)
        Persons.countDocuments({}, (err, count1) => {
          if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
          else {
            let obj = {}
            obj.name = '人员总数'
            obj.value = count1
            arr.push(obj)
            Communities.countDocuments({}, (err, count2) => {
              if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
              else {
                let obj = {}
                obj.name = '小区总数'
                obj.value = count2
                arr.push(obj)
                Users.countDocuments({}, (err, count3) => {
                  if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
                  else {
                    let obj = {}
                    obj.name = '管理员总数'
                    obj.value = count3
                    arr.push(obj)
                    Cars.countDocuments({}, (err, count4) => {
                      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
                      else {
                        let obj = {}
                        obj.name = '车辆总数'
                        obj.value = count4
                        arr.push(obj)
                        res.json({data:{
                          code: 200,
                          totalRes: arr
                        }})
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
  })
})

// 返回echarts图表信息 POST请求 当前登录网格人员
// passport 验证tocken
// private
// api/records/getNowTotals
router.post('/getNowTotals',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let  arr = []
  let query = req.body.query
  Houses.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        let obj = {}
        obj.name = '房屋总数'
        obj.value = count
        arr.push(obj)
        Persons.countDocuments(query, (err, count1) => {
          if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
          else {
            let obj = {}
            obj.name = '人员总数'
            obj.value = count1
            arr.push(obj)
            Communities.countDocuments(query, (err, count2) => {
              if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
              else {
                let obj = {}
                obj.name = '小区总数'
                obj.value = count2
                arr.push(obj)
                Cars.countDocuments(query, (err, count4) => {
                  if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
                  else {
                    let obj = {}
                    obj.name = '车辆总数'
                    obj.value = count4
                    arr.push(obj)
                    res.json({data:{
                      code: 200,
                      totalRes: arr
                    }})
                  }
                })
              }
            })
          }
        })
      }
  })
})


module.exports = router