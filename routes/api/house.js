// 房屋建档
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Houses = require('../../Schemas/houseSchema') //房屋库

// 房屋建档 POST请求
// passport 验证token
// private
// api/house/addhouse
router.post('/addhouse', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 判断该房屋是否已存在
  Houses.findOne({houseNum: req.body.houseNum, communityName: req.body.communityName})
    .then((house) => {
        if(house) {
            return res.json({data:{code:400, msg:'该房屋已存在'}})
        } else {
            const NewHouse = new Houses({
              date: req.body.date,
              gridNum: req.body.gridNum,
              gridRange: req.body.gridRange,
              communityName: req.body.communityName,
              houseNum: req.body.houseNum,
              houseSize: req.body.houseSize,
              houseHolder: req.body.houseHolder
            })
            NewHouse.save()
                .then(house => res.json({data:{code:200, msg:'新增成功', house}}))
                .catch(err => console.log(err))
        }
    })
})

// 返回房屋建档数据 POST请求
// passport 验证token
// private
// api/house/getHouses
router.post('/getHouses', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  let communityName = req.body.communityName
  Houses.countDocuments({communityName}, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      Houses.find({communityName}).skip((currentPage-1) * pageSize).limit(pageSize)
        .then(house => {
            res.json({data:{
                code: 200,
                house,
                totalCount: count
            }})
        })
        .catch(err => {
            console.log(err)
        })
    }
  })
})

// 返回房屋查询数据 POST请求
// passport 验证tocken
// private
// api/house/getSearchHouses
router.post('/getSearchHouses',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  Houses.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Houses.find(query).skip((currentPage-1) * pageSize).limit(pageSize)
          .then(house => {
              res.json({data:{
                  code: 200,
                  house,
                  totalCount: count
              }})
          })
      }
  })
})

// 返回信息门户查询数据 POST请求
// passport 验证tocken
// private
// api/house/getInfoHouses
router.post('/getInfoHouses',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  Houses.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Houses.find(query)
          .then(house => {
              res.json({data:{
                  code: 200,
                  house,
                  totalCount: count
              }})
          })
      }
  })
})

// 修改房屋信息 POST请求
// passport 验证token
// private
// api/house/modHouse
router.post('/modHouse', passport.authenticate('jwt', {session:false}), (req, res) => {
  Houses.updateOne({communityName: req.body.communityName, houseNum: req.body.houseNum},{
      houseHolder: req.body.houseHolder
  })
    .then((house) => {
      res.json({data:{
          code:200,
          msg: '修改成功'
      }})
    })
})

module.exports = router