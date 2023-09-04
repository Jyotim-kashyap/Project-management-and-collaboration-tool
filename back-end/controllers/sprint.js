const Sprint= require("../models/sprint");
var slugify = require('slugify')
const moment = require('moment');
const Task = require("../models/task");
const User = require("../models/user")


exports.getAll = async (req, res) => {
  try {
    const { projectId } = req.params;

  

    const sprint = await Sprint.find({ projectId,  archived: false })
      .populate({
        path: 'tasks',
        model: 'Task',
        populate: {
          path: 'assignee',
          model: 'User',
        },
      });

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    res.json(sprint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.create = async (req, res) => {
  try {
    let { projectId, name } = req.body;

    const existingSprint = await Sprint.findOne({ projectId,name });

    if (existingSprint) {
      return res.status(409).json({ message: 'Sprint with the same name already exists' });
    }

    const sprint = await new Sprint({ name, projectId, slug: slugify(name) }).save();
 
    res.json(sprint);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Create sprint failed' });
  }
};


  exports.taskAddToSprint = async (req, res) => {
    const { sprintId, taskId } = req.params;
  
    try {
      const sprint = await Sprint.findById({_id : sprintId});
  
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
  
      sprint.tasks.push(taskId);
      await sprint.save();
  
      const task = await Task.findOne({ _id: taskId });
  
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      task.sprint = sprintId;
      await task.save();
  
      res.json({ message: "Task added to sprint", task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
  

  exports.taskRemoveFromSprint = async (req, res) => {

    const { sprintId, taskId } = req.params;
    
  try {
    //editing the sprint
    const sprint = await Sprint.findById({_id : sprintId});

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    const taskIndex = sprint.tasks.indexOf(taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found in sprint" });
    }

    sprint.tasks.splice(taskIndex, 1); // splitting the main array
    await sprint.save();
    //editing the task
    const task = await Task.findById({_id:taskId});
    task.sprint = null; // Remove sprintId from task
    await task.save();

    res.json({ message: "Task removed from sprint" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });

  }

  }
exports.updateSprint = async (req, res) => {
  const { sprintId } = req.params;
  const { sprintData } = req.body;

  try {
    const sprint = await Sprint.findById(sprintId);

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    // Update the sprint data with the properties from sprintData (if provided)
    if (sprintData.name) {
      sprint.name = sprintData.name;
    }
    if (sprintData.goal) {
      sprint.goal = sprintData.goal;
    }
    if (sprintData.start_date) {
      sprint.start_date = moment(sprintData.start_date);
    }
    if (sprintData.end_date) {
      sprint.end_date = moment(sprintData.end_date);
    }

    await sprint.save();

    res.status(200).json({ message: "Sprint updated", sprint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


  

  exports.deleteSprint = async (req, res) => {
    const { sprintId } = req.params;
  
    try {
      const sprint = await Sprint.findByIdAndDelete(sprintId);
  
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
  
      await Task.updateMany(
        { sprint: sprintId },
        { $unset: { sprint: "" } }
      );
  
      res.json({ message: "Sprint deleted", sprint });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
;
  

  exports.completeSprint = async (req, res) => {
    try {
      const { completeSprintId } = req.params;
  
      const sprint = await Sprint.findById(completeSprintId);
  
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
      }
  
      sprint.sprintcompleted = !sprint.sprintcompleted;
  

      const updatedSprint = await sprint.save();
  
      res.json(updatedSprint);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to complete the sprint' });
    }
  };
  


exports.archiveSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;


    const sprint = await Sprint.findById(sprintId);


    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }


    sprint.archived = true;


    const archivedSprint = await sprint.save();

    res.json(archivedSprint);
  } catch (error) {
    console.error("Error archiving sprint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllArchived = async (req, res) => {
  try {

    const { projectId } = req.params;
    const archivedSprints = await Sprint.find({ projectId, archived: true })
      .populate({
        path: 'tasks',
        model: 'Task',
        populate: {
          path: 'assignee',
          model: 'User',
        },
      });
    
    res.json(archivedSprints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.unarchiveSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
  
    const sprint = await Sprint.findByIdAndUpdate(
      sprintId,
      { archived: false },
      { new: true }
    );

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    res.status(200).json({_id : sprint._id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
