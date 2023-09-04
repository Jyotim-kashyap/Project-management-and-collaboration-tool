const express = require('express')
const router = express.Router();
//middleware
const { authCheck } = require('../middlewares/auth')




// controller
const { getSprintData,getBurndownData,getBurnUpData } = require("../controllers/report");

//routes


router.get("/report/:projectId",  getSprintData);
router.get("/report/:sprintId/Burndown",  getBurndownData);
router.get("/report/:sprintId/burnup",  getBurnUpData);









module.exports = router;