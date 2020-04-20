// 机构管理
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Streets = require('../../Schemas/xinduStreetSchema')  // 街道办事处

// 新增街道办事处
// passport 验证token
// private
// api/Streets/addStreet
router.post('/addStreet',  passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该街道是否已存在
  Streets.findOne({ $or: [
    {indexNum:req.body.indexNum},
    {mechaName: req.body.mechaName}
  ]})
    .then((str) => {
        if(str) {
            return res.json({data:{code:400, msg:'该街道办已存在'}})
        } else {
            const NewStreet = new Streets({
                indexNum: req.body.indexNum,
                mechaName: req.body.mechaName,
                responsibility: req.body.responsibility,
                chargePerson: req.body.chargePerson
            })
            NewStreet.save()
                .then(str => res.json({data:{code:200, msg:'新增成功', str}}))
                .catch(err => console.log(err))
        }
    })
})

// 新增街道办明细 POST请求
// passport 验证token
// private
// api/Streets/addStreetDetail
router.post('/addStreetDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该街道办是否已存在
  Streets.findOne({indexNum:req.body.indexNum, mechaName: req.body.mechaName})
    .then((street) => {
        if(street) {
          if (street.insideData.length === 0) {
            const newInside = {
              officeTel: req.body.officeTel,
              officeAdd: req.body.officeAdd,
              peopleDuty: req.body.peopleDuty,
              streetDuty: req.body.streetDuty
            }
            street.insideData.push(newInside)
            street.save()
              .then(street => res.json({data:{code:200, msg:'新增明细成功', street}}))
          } else {
            return res.json({data: {code:200, msg:'该街道明细已存在'}})
          }
        } else {
            return res.json({data:{code:400, msg:'该街道办事处不存在'}})
        }
    })
})

// 编辑街道办 POST请求
// passport 验证token
// private
// api/Streets/modStreets
router.post('/modStreets', passport.authenticate('jwt', {session:false}), (req, res) => {
  Streets.updateOne({indexNum: req.body.indexNum1},{
      indexNum: req.body.indexNum,
      mechaName: req.body.mechaName,
      responsibility: req.body.responsibility,
      chargePerson: req.body.chargePerson
  })
    .then((dic) => {
      res.json({data:{
          code:200,
          msg: '修改成功'
      }})
    })
})

// 删除街道办 POST请求
// passport 验证token
// private
// api/Streets/deleStreet
router.post('/deleStreet', passport.authenticate('jwt', {session:false}), (req, res) => {
  Streets.deleteOne({indexNum: req.body.indexNum})
    .then((dic) => {
      res.json({data:{
          code:200,
          msg: '删除成功'
      }})
    })
})

// 获取街道办数据 POST请求
// passport 验证token
// private
// api/Streets/getStreets
router.post('/getStreets', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该字典是否已存在
  Streets.find({}, {_id: 0})
    .then((str) => {
        return res.json({data:{code:200, str}})
    })
})

module.exports = router