const express = require('express')
const router = express.Router()
const User = require("../models/user");


const { taskData } = require("../controllers/user");

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: 'projects',
      model: 'Project',
      populate: {
        path: 'createrId',
        model: 'User'
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.get('/allUser', async (req, res) => {
      try {
        const users = await User.find({});
    
        const modifiedUsers = users.map(user => {
          return { value: user.email, id: user._id,...user._doc };
        });
    
        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json(modifiedUsers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});
    
router.get('/user/:id/taskdata', taskData);

module.exports = router;