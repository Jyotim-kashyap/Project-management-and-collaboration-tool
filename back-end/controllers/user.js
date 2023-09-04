const User = require("../models/user");
const Task = require("../models/task");

exports.taskData = async (req, res) => {
    const { id } = req.params;
  
    try {
  
      const user = await User.findById(id).populate({
        path: "task",
        model: "Task"
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const tasks = user.task;
      
      if (!tasks || tasks.length === 0) {
      
        return res.status(200).json({ message: 'User has no assigned tasks' });
      }
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      res.status(500).json({ message: 'Error fetching user tasks' });
    }
  };