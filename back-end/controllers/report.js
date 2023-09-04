const Sprint = require('../models/sprint');
const Task = require("../models/task");



exports.getSprintData = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      if (!projectId) {
        return res.status(400).json({ message: 'projectId parameter is missing' });
      }
  
      const sprints = await Sprint.find({ projectId }).populate({
                path: 'tasks',
                model: 'Task',
              });;
        
  
      if (sprints.length === 0) {
        return res.status(404).json({ message: 'No sprints found for the provided projectId' });
      }
  // formatting the data here
      const formattedData = sprints.map(sprint => ({
        sprintId: sprint._id,
        sprint: sprint.name,
        totalStoryPoints: sprint.tasks.reduce((total, task) => total + task.storyPoints, 0),
        completedStoryPoints: sprint.tasks.reduce((total, task) => {
          if (task.transition === 'Done') {
            return total + task.storyPoints;
          } else {
            return total;
          }
        }, 0)
      }));
  
      res.status(200).json(formattedData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  






exports.getBurndownData = async (req, res) => {
  const { sprintId } = req.params;

  try {
    const sprint = await Sprint.findById(sprintId).populate({
      path: 'tasks',
      model: 'Task',
    });

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const tasks = sprint.tasks;

    // Sort tasks by doneDate in ascending order
    tasks.sort((a, b) => new Date(a.doneDate) - new Date(b.doneDate));


    const startDate = new Date(sprint.start_date);
    const endDate = new Date(sprint.end_date);

    let totalStoryPoints = 0;
    tasks.forEach((task) => {
      totalStoryPoints += task.storyPoints;
    });

    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const dates = [];

    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dates.push(currentDate.toISOString().substring(0, 10));
      console.log(currentDate)
    }

    const tasksByDate = {};

    tasks.forEach((task) => {
      const doneDate = task.doneDate;

      if (doneDate instanceof Date && !isNaN(doneDate.getTime())) {
        const dateKey = doneDate.toISOString().substring(0, 10);

        if (!tasksByDate[dateKey]) {
          tasksByDate[dateKey] = [];
        }

        tasksByDate[dateKey].push(task);
      }
    });

    for (const date in tasksByDate) {
      const tasks = tasksByDate[date];
      let totalStoryPoints = 0;

      tasks.forEach((task) => {
        totalStoryPoints += task.storyPoints;
      });

    
      tasksByDate[date] = {
        tasks: tasks,
        totalStoryPointsByDate: totalStoryPoints,
      };
    }


    const transformedData = [];
    let remainingPoints = totalStoryPoints;


    for (const date in tasksByDate) {
      const tasks = tasksByDate[date];
      const totalStoryPointsByDate = tasks.totalStoryPointsByDate;

      remainingPoints -= totalStoryPointsByDate;

  
      transformedData.push({ date, remainingPoints });
    }



    res.json(transformedData);
  } catch (error) {
    console.error('Error retrieving burndown data:', error);
    res.status(500).json({ message: 'Error retrieving burndown data' });
  }
};



exports.getBurnUpData = async (req, res) => {
  const { sprintId } = req.params;

  try {
    const sprint = await Sprint.findOne({ _id: sprintId }).populate({
      path: 'tasks',
      model: 'Task',
    });

    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    const { start_date, end_date, tasks } = sprint;

    const currentDate = new Date(start_date);
    currentDate.setDate(currentDate.getDate() + 1); // Move currentDate one day ahead bcuz of the way it is being stored
    const endDate = new Date(end_date);
    endDate.setDate(endDate.getDate() + 1);
    const dailyData = [];
    let totalTasks = tasks.length;
    let completedTasks = 0;

    // Group tasks by creation date adn counting the tasks
    const tasksByCreationDate = {};
    tasks.forEach(task => {
      const creationDate = task.createdAt.toISOString().substring(0, 10);
      if (tasksByCreationDate[creationDate]) {
        tasksByCreationDate[creationDate]++;
      } else {
        tasksByCreationDate[creationDate] = 1;
      }
    });

    while (currentDate <= endDate) {
      const datePart = currentDate.toISOString().substring(0, 10);
      const remainingTasks = tasks.filter(
        task => task.doneDate === null || task.doneDate > currentDate
      ).length;
      const newCompletedTasks = tasks.filter(
        task => task.doneDate !== null && task.doneDate.toISOString().substring(0, 10) === datePart
      ).length;
      completedTasks += newCompletedTasks;

      const createdTasks = dailyData.length > 0
        ? dailyData[dailyData.length - 1].createdTasks + (tasksByCreationDate[datePart] || 0)
        : tasksByCreationDate[datePart] || 0;

      dailyData.push({
        date: datePart,
        totalTasks,
        remainingTasks,
        completedTasks,
        createdTasks
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json({ burnUpData: dailyData });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



