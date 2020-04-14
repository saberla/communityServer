// 记录操作日志
const express = require('express')
const router = express.Router()
const passport = require('passport')

const opRecords = require('../../Schemas/opRecordSchema') // 记录库

// 写入登录记录 请求会带数据 POST请求
// public
// api/opRecords/writeRecords
router.post('/writeRecords', (req, res) => {
  const newRecord = new opRecords({
    userName: req.body.userName,
    role: req.body.role,
    tel: req.body.tel,
    name: req.body.name,
    operate: req.body.operate
  })
  newRecord.save()
    .then(record => res.json({data:{code:200, msg:'写入登录记录成功'}}))
    .catch(err => {console.log(err)})
})

// 返回操作日志 POST请求
// passport 验证token
// api/opRecords/getRecords
router.post('/getRecords', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  opRecords.countDocuments({}, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      opRecords.find({}).skip((currentPage-1) * pageSize).limit(pageSize)
        .then(records => {
            res.json({data:{
                code: 200,
                records,
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