// 记录登录日志
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Records = require('../../Schemas/logRecordShema') // 记录库

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

module.exports = router