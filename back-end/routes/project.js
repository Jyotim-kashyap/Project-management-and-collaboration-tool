const express = require('express')
const router = express.Router();
//middleware
const { authCheck } = require('../middlewares/auth')




// controller
const { create, list,  userAdd, getMemberProjects } = require("../controllers/project");

//routes
router.post("/project", authCheck, create);
router.get("/project/:id", list);
router.post("/project/userAdd",  userAdd);
router.get("/project/user/:userId", getMemberProjects);






module.exports = router;