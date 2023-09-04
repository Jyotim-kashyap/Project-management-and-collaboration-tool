const Project = require("../models/project");
const User = require("../models/user");

var slugify = require('slugify')

exports.create = async (req, res) => {
  try {
  const { createrId, name } = req.body
  const project = await new Project({name,createrId, slug: slugify(name)}).save()
  
  res.json(project)
} catch(err) {
  console.log(err)
    res.status(400).send('Create project failed')
  }
}
exports.read = async (req, res) => { // not being used 
  try {
    const id = req.params.id;
    const slug = req.params.slug;

    // Input testing
    if (!id || !slug) {
      return res.status(400).json({ error: 'Invalid inputs: id and slug are required.' });
    }

    const project = await Project.findOne({ createrId : id, slug: slug });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.status(200).json(project);
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
}
}

 exports.list = async (req, res) => {

  try {
    const id = req.params.id;
    const project = await Project.find({ createrId: id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
   
 }

 exports.userAdd = async (req, res) => {
  const { email, projectId } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

// Check if the user already exists in the project
const existingUser = project.users.find(userId => userId.equals(user._id));
if (existingUser) {
  return res.status(400).json({ message: 'User already exists in the project' });
}

    project.users.push(user._id);
    await project.save();

    user.projects.push(project._id);
    await user.save();

    res.status(200).json({ message: 'User added to project' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMemberProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ users: userId }).exec();

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for the user." });
    }

    const formattedProjects = projects.map((project) => ({
      ...project._doc,
      key: project._id, // Add key as _id
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    res.status(500).json({ error: "Failed to fetch projects. Please try again later." });
  }
};
