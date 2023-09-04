const path = require('path');
const Task = require("../models/task");



exports.upload = async (req, res) => {
    if (!req.files || !req.files.file) {
      res.status(400).send('No file was uploaded');
      return;
    }
  
    const file = req.files.file;
    const filename = Date.now() + "__" + file.name;
    const uploadPath = path.join(__dirname, "../public", filename);


    file.mv(uploadPath, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
        return;
      }
  
      const taskId = req.params.taskid;
  
      try {
        const task = await Task.findById(taskId);
  
        const fileUrl = path.resolve(uploadPath);

        console.log("reso",fileUrl)
        const fileObj = { url: fileUrl, type: file.mimetype };
        task.imageUrl.push(fileObj);
  
        await task.save();
      
        res.json({ fileObj });
  
      } catch (error) {
        console.error('Error saving file URL to task:', error);
        res.status(500).send('Error saving file URL to task');
      }
    });
  };
  

exports.download = async (req, res) => {
    const taskId = req.params.task_id;
  
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Assuming `task.imageUrl` is an array of objects with `url` and `type` properties
      const imageFiles = task.imageUrl;
  
      // Create a custom response object that contains the image metadata and URLs
      const responseObj = {
        imageFiles: imageFiles.map((imageFile) => {
          return {
            url: imageFile.url,
            type: imageFile.type
          };
        })
      };
  
      // Set the response headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=images.json`);
  
      // Send the response as JSON
      res.status(200).json(responseObj);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.getfile = async (req, res) => {
    const imageUrl = req.body.url; // Assuming the URL is passed as a parameter
  
    try {
      const absolutePath = path.resolve(imageUrl);
  
      // Set the appropriate Content-Type header based on the file extension
      const contentType = getContentTypeFromExtension(path.extname(absolutePath));
      res.set('Content-Type', contentType);
  
      res.sendFile(absolutePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const getContentTypeFromExtension = (extension) => {
    const extensionMap = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',

    };

    const contentType = extensionMap[extension.toLowerCase()];
  
    return contentType || 'application/octet-stream';
  };
  


  