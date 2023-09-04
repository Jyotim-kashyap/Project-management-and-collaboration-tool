
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload")
const { readdirSync } = require("fs");
const { Server } = require("socket.io");
const Room = require("./models/room")

require("dotenv").config();

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(fileUpload());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.static('public'));



// routes middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

// server
const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${process.env.PORT || 8000}`);
});

// socket.io
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000"
  }
});
// io.listen(server);


//Array of users
const users = [];
const addUser = ({ id, userId, name, userEmail }) => {
  const existingUser = users.find(
    user => user.name === name && user.userId === userId
  );

  if (!userId || !name) {
    return { error: 'Username and room are required.' };
  }

  if (existingUser) {
    return null;
  }

  const user = { id, userId, name, userEmail };
  users.push(user);
 
  return { user };
};

io.on("connection", (socket) => {

//ping pong 
socket.on('ping', () => {

  socket.emit('pong');
});








  socket.on('join-room', ({ userId, name, userEmail }) => {
    
    const user = addUser({ id: socket.id, userId , name, userEmail});
    if (user === null) {

      return;
    }
    
    socket.join(name);
    const userIdObj = mongoose.Types.ObjectId(userId); // cast userId to ObjectId
// fix here
    Room.findOneAndUpdate({ name }, { $addToSet: { users: userIdObj } }, { new: true })
      .populate('users')
      .exec((err, updatedRoom) => {
        if (err) {
          console.error(err);
          return;
        }

        socket.emit('message', {
          user: userEmail,
          updatedRoom
        });

        socket.broadcast.to(name).emit('message', {
          user: userEmail,
          updatedRoom
        });
      });
  });


  
socket.on("card-selected", async ({ userId, name, value, userEmail }) => {
  const user = users.find(user => user.userId === userId);
  if (!user) {
    return;
  }


  try {
    const room = await Room.findOne({ name });
    const existingEstimateIndex = room.results.findIndex(result => result.user === userId);
    if (existingEstimateIndex >= 0) {
      room.results[existingEstimateIndex].estimate = value;
    } else {
      room.results.push({ user: userId, estimate: value, userEmail });
    }
    await room.save();
    io.to(name).emit("card-selected", room,userEmail);
    console.log(`Estimate ${value} added to room ${name}`);
  } catch (err) {
    console.log(`Error adding estimate to room ${name}: ${err}`);
  }
});

socket.on("reveal", async ( showCardValues) => {
  socket.broadcast.emit("reveal", showCardValues);

});


});






  




