const express = require('express')
const router = express.Router();
//middleware
const { authCheck } = require('../middlewares/auth')




// controller
const { upload,download, getfile } = require("../controllers/fileUpload");

//routes

router.post("/task/:taskid/fileupload", upload);
router.get("/task/:task_id/image", download);
router.post("/task/:task__id/getfile", getfile);









module.exports = router;