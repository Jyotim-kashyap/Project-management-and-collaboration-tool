
const slugify = require('slugify')
const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const Sprint= require("../models/sprint");






// exports.create = async (req, res) => {
 
//   try {
//     const { title, description, projectId, typeOfTask, sprintId } = req.body;

//     if (!title || !description || !typeOfTask) {
//       return res.status(400).json({ message: 'Title, description, and typeOfTask are required' });
//     }

//     const slug = slugify(title, { lower: true });

//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     let task;
//     if (sprintId) {
//       const sprint = await Sprint.findById(sprintId);
//       if (!sprint) {
//         return res.status(404).json({ message: 'Sprint not found' });
//       }
//       task = new Task({ title, project: projectId, description, slug, typeOfTask, sprint: sprintId });
//       sprint.tasks.push(task._id);
//       await sprint.save();
  
//     } else {
//       task = new Task({ title, project: projectId, description, slug, typeOfTask });
//     }

//     const savedTask = await task.save();

//     res.json(savedTask);
//   } catch (err) {
//     if (err.code === 11000) {
     
//       res.status(409).send({message : "Duplicate name not allowed"});
//     } else {
//       res.status(400).send("Task creation failed");
//     }
//   }
// };
exports.create = async (req, res) => {
  try {
    const { title, description, projectId, typeOfTask, sprintId } = req.body;

    if (!title || !description || !typeOfTask) {
      return res.status(400).json({ message: 'Title, description, and typeOfTask are required' });
    }

   

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingTask = await Task.findOne({ title, project: projectId });
    if (existingTask) {
      return res.status(409).json({ message: 'Task with the same title already exists in this project' });
    }

    let task;
    if (sprintId) {
      const sprint = await Sprint.findById(sprintId);
      if (!sprint) {
        return res.status(404).json({ message: 'Sprint not found' });
      }
      task = new Task({ title, project: projectId, description, typeOfTask, sprint: sprintId });
      sprint.tasks.push(task._id);
      await sprint.save();
    } else {
      task = new Task({ title, project: projectId, description,  typeOfTask });
    }

    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Duplicate name not allowed" });
    } else {
      res.status(400).json({ message: "Task creation failed" });
    }
  }
};


exports.list = async (req, res) => {

    try {
        const id = req.body.projectId;

       
        const task = await Task.find({project: id}).populate({
      path: 'assignee',
      model: 'User',
    });;
    
        if (!task) {
          return res.status(404).json({ message: 'No task found' });
        }
    
        res.json(task);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
      }
}

exports.read = async (req, res) => {
  try {
    const taskId = req.params.taskid;
    console.log(taskId)
    const task = await Task.findOne({_id : taskId});
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
}


exports.test = async (req, res) => {
  const { pid } = req.params; 

  try {
    const project = await Project.findOne({ _id : pid }).populate({
      path: 'users',
      model: 'User',
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' }); 
    }
    res.status(200).json(project); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' }); 
  }
}



exports.update = async (req, res) => {
  const { taskid } = req.params;
  const { task } = req.body;
console.log(task.assignee)
  try {
    const existingTask = await Task.findById(taskid);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignee && Array.isArray(task.assignee)) {
      existingTask.assignee = [...existingTask.assignee, ...task.assignee];
      existingTask.project = existingTask.project || req.body.project;


      for (const assigneeId of task.assignee) {
        const user = await User.findById(assigneeId);
        if (user) {
          user.task = [...user.task, existingTask._id];
          await user.save();
        }
      }

    }

 

    existingTask.title = task.title || existingTask.title;
    existingTask.transition = task.transition || existingTask.transition;
    existingTask.sprint = task.sprint || existingTask.sprint;
    existingTask.description = task.description || existingTask.description;
    existingTask.labels = task.labels || existingTask.labels;
    existingTask.duedate = task.duedate || existingTask.duedate;
    existingTask.storyPoints = task.storyPoints || existingTask.storyPoints;
    existingTask.typeOfTask = task.typeOfTask || existingTask.typeOfTask;


    if (task.transition === 'Done' ) {
      const currentDate = new Date();
      currentDate.setHours(23, 59, 59, 999); // Set the time to the end of the day
      existingTask.doneDate = currentDate;
    } else if (task.transition !== 'Done') {
      existingTask.doneDate = null; 
    }

    const updatedTask = await existingTask.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};




exports.createComment = async (req, res) => {
  const { taskId } = req.params;
  const { commentText } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!commentText) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    task.comments.push(commentText);
    await task.save();

    res.json(task.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskid;
    
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    await task.remove();

    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
}


exports.getTasksByProjectId = async (req, res) => {
  // router.get("/task/project/:projectId", getTasksByProjectId);

  try {
    const { projectId } = req.params;

    const tasks = await Task.find({project: projectId }).populate({
      path: 'assignee',
      model: 'User'
    });

    const groupedTasks = {
      todo: tasks.filter(task => task.transition === 'ToDo'),
      inProgress: tasks.filter(task => task.transition === 'InProgress'),
      Done: tasks.filter(task => task.transition === 'Done'),
    };

    res.json(groupedTasks);
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
};