// 人员建档
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Persons = require('../../Schemas/personSchema') //人员库

// 人员建档 POST请求
// passport 验证token
// private
// api/persons/addperson
router.post('/addperson', passport.authenticate('jwt', {session:false}), (req, res) => {
  const NewPerson = new Persons({
    date: req.body.date,
    gridNum: req.body.gridNum,
    gridRange: req.body.gridRange,
    communityName: req.body.communityName,
    personName: req.body.personName,
    personSex: req.body.personSex,
    personAdd: req.body.personAdd,
    personTel: req.body.personTel
  })
  NewPerson.save()
      .then(person => res.json({data:{code:200, msg:'新增成功', person}}))
      .catch(err => console.log(err))
})

// 返回人员建档数据 POST请求
// passport 验证token
// private
// api/persons/getPersons
router.post('/getPersons', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  let communityName = req.body.communityName
  Persons.countDocuments({communityName}, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      Persons.find({communityName}).skip((currentPage-1) * pageSize).limit(pageSize)
        .then(person => {
            res.json({data:{
                code: 200,
                person,
                totalCount: count
            }})
        })
        .catch(err => {
            console.log(err)
        })
    }
  })
})

// 返回人员查询数据 POST请求
// passport 验证token
// private
// api/persons/getSearchPersons
router.post('/getSearchPersons',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  Persons.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Persons.find(query).skip((currentPage-1) * pageSize).limit(pageSize)
          .then(person => {
              res.json({data:{
                code: 200,
                person,
                totalCount: count
              }})
          })
      }
  })
})

// 返回信息门户查询数据 POST请求
// passport 验证token
// private
// api/persons/getInfoPersons
router.post('/getInfoPersons',passport.authenticate('jwt', {session:false}) , (req, res) => {
  let query = req.body.query
  Persons.countDocuments(query, (err, count) => {
      if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
      else {
        Persons.find(query)
          .then(person => {
              res.json({data:{
                code: 200,
                person,
                totalCount: count
              }})
          })
      }
  })
})

// 修改人员信息 POST请求
// passport 验证token
// private
// api/persons/modPerson
router.post('/modPerson', passport.authenticate('jwt', {session:false}), (req, res) => {
  Persons.updateOne({communityName: req.body.communityName, _id: req.body.id},{
      personName: req.body.personName,
      personTel: req.body.personTel,
      personAdd: req.body.personAdd
  })
    .then((person) => {
      res.json({data:{
          code:200,
          msg: '修改成功'
      }})
    })
})

// 删除人员 POST请求
// passport 验证token
// private
// api/persons/delPerson
router.post('/delPerson', passport.authenticate('jwt', {session:false}), (req, res) => {
  Persons.deleteOne({communityName: req.body.communityName, _id: req.body.id})
    .then((com) => {
      res.json({data:{
          code:200,
          msg: '删除成功'
      }})
    })
    .catch(err => {console.log('错误saber',err)})
})

module.exports = router