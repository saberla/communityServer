// 记录系统日志
const express = require('express')
const router = express.Router()
const passport = require('passport')

const sysRecords = require('../../Schemas/systemRecordSchema') // 系统日志库

// 写入系统出错记录 请求会带数据 POST请求
// public
// api/sysRecords/writeRecords
router.post('/writeRecords', (req, res) => {
  const newRecord = new sysRecords({
    wrongInfo: req.body.wrongInfo,
    wrongPlace: req.body.wrongPlace,
    userName: req.body.userName,
    name: req.body.name
  })
  newRecord.save()
    .then(record => res.json({data:{code:200, msg:'写入系统日志记录成功'}}))
    .catch(err => {console.log(err)})
})

// 返回系统出错日志 POST请求
// passport 验证token
// api/sysRecords/getRecords
router.post('/getRecords', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  sysRecords.countDocuments({}, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      sysRecords.find({}).skip((currentPage-1) * pageSize).limit(pageSize)
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