// 字典管理
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Dictionaries = require('../../Schemas/dictionarySchema') //字典库

// 新增字典 POST请求
// passport 验证token
// private
// api/dictionary/addDic
router.post('/addDic', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该字典是否已存在
  Dictionaries.findOne({ $or: [
    {dictionaryName:req.body.dictionaryName},
    {dictionaryType: req.body.dictionaryType}
  ]})
    .then((dic) => {
        if(dic) {
            return res.json({data:{code:400, msg:'该字典已存在'}})
        } else {
            const NewDic = new Dictionaries({
                dictionaryName: req.body.dictionaryName,
                dictionaryType: req.body.dictionaryType
            })
            NewDic.save()
                .then(dic => res.json({data:{code:200, msg:'新增成功', dic}}))
                .catch(err => console.log(err))
        }
    })
})

// 新增字典明细 POST请求
// passport 验证token
// private
// api/dictionary/addDicDetail
router.post('/addDicDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
    // 判断该字典是否已存在
    Dictionaries.findOne({dictionaryName:req.body.dictionaryName, dictionaryType: req.body.dictionaryType})
      .then((dic) => {
          if(dic) {
              const newInside = {
                  option: req.body.option
              }
              dic.insideData.push(newInside)
              dic.save()
                .then(dic => res.json({data:{code:200, msg:'新增明细成功', dic}}))
          } else {
              return res.json({data:{code:400, msg:'该字典不存在'}})
          }
      })
  })

// 修改字典 POST请求
// passport 验证token
// private
// api/dictionary/modDic
router.post('/modDic', passport.authenticate('jwt', {session:false}), (req, res) => {
    Dictionaries.updateOne({dictionaryName: req.body.dictionaryName1},{
        dictionaryName: req.body.dictionaryName,
        dictionaryType: req.body.dictionaryType
    })
      .then((dic) => {
        res.json({data:{
            code:200,
            msg: '修改成功'
        }})
      })
  })

// 修改字典明细 POST请求
// passport 验证token
// private
// api/dictionary/modDicDetail
router.post('/modDicDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
    Dictionaries.findOne({dictionaryName:req.body.dictionaryName})
      .then((dic) => {
          if(dic) {
              dic.insideData.forEach((el,index) => {
                  if (el.option === req.body.option1) {
                      el.option = req.body.option
                  }
              })
              dic.save()
                .then(dic => res.json({data:{code:200, msg:'修改成功', dic}}))
          }
      })
  })

// 删除字典 POST请求
// passport 验证token
// private
// api/dictionary/deleteDic
router.post('/deleteDic', passport.authenticate('jwt', {session:false}), (req, res) => {
    Dictionaries.deleteOne({dictionaryName: req.body.dictionaryName})
      .then((dic) => {
        res.json({data:{
            code:200,
            msg: '删除成功'
        }})
      })
  })

// 删除字典明细 POST请求
// passport 验证token
// private
// api/dictionary/deleteDetail
router.post('/deleteDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
    Dictionaries.findOne({dictionaryName:req.body.dictionaryName})
      .then((dic) => {
          if(dic) {
              let tempIndex = 0
              dic.insideData.forEach((el,index) => {
                  if (el.option === req.body.option) {
                      tempIndex = index
                  }
              })
              dic.insideData.splice(tempIndex, 1)
              dic.save()
                .then(dic => res.json({data:{code:200, msg:'删除成功', dic}}))
          }
      })
  })

// 获取字典数据 POST请求
// passport 验证token
// private
// api/dictionary/getDic
router.post('/getDic', (req, res) => {
    // 判断该字典是否已存在
    Dictionaries.find({}, {_id: 0})
      .then((dic) => {
          return res.json({data:{code:200, dic}})
      })
  })

module.exports = router