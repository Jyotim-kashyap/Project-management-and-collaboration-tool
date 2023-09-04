const CodeUpdate = require("../models/codeUpdate")
const User = require("../models/user");


exports.create = async (req, res) => {
 
  try {
    //  all the required fields are present
   
    const requiredFields = ['requestDate', 'developer', 'changeDetails', 'changePath', 'priority', 'systemAdmin', 'deploymentDate'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const newCodeUpdate = new CodeUpdate(req.body);

    const [developer, systemAdmin] = await Promise.all([
      User.findById(req.body.developer),
      User.findById(req.body.systemAdmin)
    ]);

    if (!developer || !systemAdmin) {
      throw new Error('Invalid developer or system admin ID');
    }

    await newCodeUpdate.save();

    const populatedCodeUpdate = await newCodeUpdate
      .populate({
        path: 'systemAdmin',
        model: 'User'
      })
      .populate({
        path: 'developer',
        model: 'User'
      })
      .execPopulate();

    res.status(201).json(populatedCodeUpdate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  exports.getAll = async (req, res) => {
    try {
      const updates = await CodeUpdate
        .find({ project: req.params.id })
        .populate({
          path: 'systemAdmin',
          model: 'User'
        })
        .populate({
          path: 'developer',
          model: 'User'
        })
      if (!updates) {
        return res
          .status(404)
          .json({ message: "No updates found for the project" });
      }
      res.status(200).json(updates);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };



exports.remove = async (req, res) => {

  try {
    const { codeUpdateId } = req.params;
    
  
    const codeUpdate = await CodeUpdate.findById(codeUpdateId);

    if (!codeUpdate) {
      return res.status(404).json({ error: 'Code update not found' });
    }

   

    await codeUpdate.remove();

    return res.json({ message: 'Code update deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
