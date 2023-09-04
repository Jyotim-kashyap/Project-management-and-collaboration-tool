const express = require('express')
const router = express.Router();
//middleware
const { authCheck } = require('../middlewares/auth')




// controller
const { create, list, read, test, update, createComment, deleteTask,getTasksByProjectId } = require("../controllers/task");


//routes
router.get("/task/project/:projectId", getTasksByProjectId);

router.post("/task", create);
router.post("/task/list",  list);
router.get("/task/:taskid",  read);
router.delete("/task/:taskid",  deleteTask);

//project data from taskdetails
router.get("/task/project/:pid/users",  test); // yet to be modified
//update task
router.put("/task/:taskid",  update); // yet to be modified

router.patch("/task/:taskId/comment",  createComment);






module.exports = router;