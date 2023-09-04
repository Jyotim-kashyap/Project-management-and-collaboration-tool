const express = require('express');
const router = express.Router();


//middleware
const { authCheck } = require('../middlewares/auth');

// controller
const { create,toggleVisibility  } = require('../controllers/scrumpoker');


// routes
router.patch('/scrumpoker/:roomName/visibility', toggleVisibility);

router.get('/scrumpoker',  create);


module.exports = router;
