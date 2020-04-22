// 车辆建档
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Cars = require('../../Schemas/carSchema') //车辆库

// 车辆建档 POST请求
// passport 验证token
// private
// api/cars/addcar
router.post('/addcar', passport.authenticate('jwt', {session:false}), (req, res) => {
  const NewCar = new Cars({
    date: req.body.date,
    gridNum: req.body.gridNum,
    gridRange: req.body.gridRange,
    communityName: req.body.communityName,
    carNum: req.body.carNum,
    carHolder: req.body.carHolder,
    carColor: req.body.carColor
  })
  NewCar.save()
      .then(car => res.json({data:{code:200, msg:'新增成功', car}}))
      .catch(err => console.log(err))
})

// 返回车辆建档数据 POST请求
// passport 验证token
// private
// api/cars/getCars
router.post('/getCars', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  let communityName = req.body.communityName
  Cars.countDocuments({communityName}, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      Cars.find({communityName}).skip((currentPage-1) * pageSize).limit(pageSize)
        .then(car => {
            res.json({data:{
              code: 200,
              car,
              totalCount: count
            }})
        })
        .catch(err => {
            console.log(err)
        })
    }
  })
})

// 返回车辆查询数据 POST请求
// passport 验证tocken
// private
// api/cars/getSearchCars
router.post('/getSearchCars',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  Cars.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Cars.find(query).skip((currentPage-1) * pageSize).limit(pageSize)
          .then(cars => {
              res.json({data:{
                code: 200,
                cars,
                totalCount: count
              }})
          })
      }
  })
})

// 返回信息门户查询数据 POST请求
// passport 验证tocken
// private
// api/cars/getInfoCars
router.post('/getInfoCars',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  Cars.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Cars.find(query)
          .then(cars => {
              res.json({data:{
                code: 200,
                cars,
                totalCount: count
              }})
          })
      }
  })
})

// 修改车辆信息 POST请求
// passport 验证token
// private
// api/cars/modCar
router.post('/modCar', passport.authenticate('jwt', {session:false}), (req, res) => {
  Cars.updateOne({communityName: req.body.communityName, _id: req.body.id},{
      carNum: req.body.carNum,
      carHolder: req.body.carHolder,
      carColor: req.body.carColor
  })
    .then((car) => {
      res.json({data:{
          code:200,
          msg: '修改成功'
      }})
    })
})

// 删除车辆 POST请求
// passport 验证token
// private
// api/cars/delCar
router.post('/delCar', passport.authenticate('jwt', {session:false}), (req, res) => {
  Cars.deleteOne({communityName: req.body.communityName, _id: req.body.id})
    .then((car) => {
      res.json({data:{
          code:200,
          msg: '删除成功'
      }})
    })
    .catch(err => {console.log('错误saber',err)})
})

module.exports = router