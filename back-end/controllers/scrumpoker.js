const Room = require("../models/room")
const User = require("../models/user")




exports.create = async (req, res) => {
  

  try {
    const roomId = Math.random().toString(36).substring(2, 8); //base 26,substrng bcuz base 36 starts with 0
    const room = new Room({ name: roomId });
    await room.save();
    res.status(201).json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }

  };
  
  exports.toggleVisibility = async (req, res) => {
    try {
      const { roomName } = req.params;
  
      // Find the room by name in the database
      const room = await Room.findOne({ name: roomName }).populate({
        path: 'users',
        model: 'User'
      });
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Toggle the visibility of the room
      room.visibility = !room.visibility;
      await room.save();
  
      res.json({ message: 'Visibility toggled successfully', room });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to toggle visibility' });
    }
  };
  