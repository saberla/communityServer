// 任务管理
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Tasks = require('../../Schemas/taskSchema') //任务库

// 新建任务 POST请求
// passport 验证token
// private
// /api/task/addTask
router.post('/addTask', passport.authenticate('jwt', {session:false}), (req, res) => {
  const NewTask = new Tasks({
    gridRange: req.body.gridRange,
    taskType: req.body.taskType,
    taskAmount: req.body.taskAmount,
    quality: req.body.quality,
    process: req.body.process,
    checked: req.body.checked,
    gridPerson: req.body.gridPerson
  })
  NewTask.save()
    .then(task => res.json({data:{code:200, msg:'新建任务成功', task}}))
    .catch(err => console.log(err))
})

// 新增任务明细 POST请求
// passport 验证token
// private
// // api/task/addTaskDetail
router.post('/addTaskDetail', passport.authenticate('jwt', {session:false}), (req, res) => {
  Tasks.findOne({gridRange:req.body.gridRange, taskType: req.body.taskType})
    .then((task) => {
        if(task) {
            const newInside = {
                userName: req.body.userName,
                name: req.body.name,
                tel: req.body.tel,
                education: req.body.education,
                nation: req.body.nation,
                taskAmount: req.body.taskAmount
            }
            task.insideData.push(newInside)
            task.save()
              .then(task => res.json({data:{code:200, msg:'创建网格成功', task}}))
        } else {
            return res.json({data:{code:400, msg:'该用户不存在'}})
        }
    })
})

// 返回任务列表 POST请求
// passport 验证token
// private
// /api/task/getTasks
router.post('/getTasks', passport.authenticate('jwt', {session:false}), (req, res) => {
  let currentPage = req.body.currentPage
  let pageSize = req.body.pageSize
  let query = req.body.query
  Tasks.countDocuments(query, (err, count) => {
    if (err) {res.json({data: {code: 400, msg: `${JSON.stringify(err)}`}})}
    else {
      Tasks.find(query).skip((currentPage-1) * pageSize).limit(pageSize)
        .then(task => {
            res.json({data:{
                code: 200,
                task,
                totalCount: count
            }})
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
})


// 任务指派 POST请求
// passport 验证token
// private
// /api/task/assignTask
router.post('/assignTask', passport.authenticate('jwt', {session:false}), (req, res) => {
  Tasks.updateOne({_id: req.body.id},{
    gridRange: req.body.gridRange,
    taskType: req.body.taskType,
    taskAmount: req.body.taskAmount,
    quality: req.body.quality,
    process: req.body.process,
    checked: req.body.checked,
    gridPerson: req.body.gridPerson
  })
    .then((task) => {
      res.json({data:{
          code:200,
          msg: '修改成功'
      }})
    })
})

// 删除任务 POST请求
// passport 验证tocken
// private
// api/task/deleteTask
router.post('/deleteTask', passport.authenticate('jwt', {session:false}), (req, res) => {
  Tasks.deleteOne({_id: req.body.id})
  .then(user => {
      res.json({data:{
          code:200,
          msg: '移除成功'
      }})
  })
  .catch(err => {
      console.log(err)
  })
})

module.exports = router