// 小区治理
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Communities = require('../../Schemas/communitySchema') // 小区库

// 新增小区 POST请求
// passport 验证token
// private
// api/community/addCommunity
router.post('/addCommunity', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该小区是否已存在
  Communities.findOne({communityName: req.body.communityName})
    .then((community) => {
        if(community) {
            return res.json({data:{code:400, msg:'该小区已存在'}})
        } else {
            const NewCommunity = new Communities({
                communityName: req.body.communityName,
                communityAdd: req.body.communityAdd,
                developCompany: req.body.developCompany,
                property: req.body.property,
                gridNum: req.body.gridNum,
                gridRange: req.body.gridRange
            })
            NewCommunity.save()
                .then(com => res.json({data:{code:200, msg:'新增成功', com}}))
                .catch(err => console.log(err))
        }
    })
})

// 修改小区信息 POST请求
// passport 验证token
// private
// api/community/modCommunity
router.post('/modCommunity', passport.authenticate('jwt', {session:false}), (req, res) => {
  Communities.updateOne({gridNum: req.body.gridNum, communityName: req.body.communityName1},{
      communityName: req.body.communityName,
      communityAdd: req.body.communityAdd,
      developCompany: req.body.developCompany,
      property: req.body.property
  })
    .then((com) => {
      res.json({data:{
          code:200,
          msg: '修改成功'
      }})
    })
})

// 删除小区 POST请求
// passport 验证token
// private
// api/community/deleCommunity
router.post('/deleCommunity', passport.authenticate('jwt', {session:false}), (req, res) => {
  Communities.deleteOne({gridNum: req.body.gridNum, communityName: req.body.communityName})
    .then((com) => {
      res.json({data:{
          code:200,
          msg: '删除成功'
      }})
    })
})

// 获取小区数据 POST请求
// passport 验证token
// private
// api/community/getCommunities
router.post('/getCommunities', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该字典是否已存在
  Communities.find({gridNum: req.body.gridNum, gridRange: req.body.gridRange}, {_id: 0})
    .then((com) => {
        return res.json({data:{code:200, com}})
    })
})

// 返回小区查询数据 POST请求
// passport 验证tocken
// private
// api/community/getSearchComs
router.post('/getSearchComs',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  Communities.countDocuments({}, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Communities.find(query).skip((currentPage-1) * pageSize).limit(pageSize)
          .then(coms => {
              res.json({data:{
                  code: 200,
                  coms,
                  totalCount: count
              }})
          })
      }
  })
})

module.exports = router