const express = require('express');
const router = express.Router();
//middleware
const { authCheck } = require('../middlewares/auth');

// controller
const { create, getAll, remove } = require('../controllers/codeUpdate');

// routes
router.post('/project/:id/codeupdate', create);
router.get('/project/:id/codeupdate',  getAll);
router.delete('/project/:id/codeupdate/:codeUpdateId', remove);

module.exports = router;
