const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {

  const { name, picture, email } = req.user;
  // const {name, email, role, designation}  = req.body
  const user = await User.findOneAndUpdate(
    { email },
    { name, picture, email },
    { new: true }
  );
  if (user) {
    console.log("USER UPDATED", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name,
      picture,
    }).save();
    console.log("USER CREATED", newUser);
    res.json(newUser);
  }
};


exports.currentUser = async (req, res) => {
  
  const authHeader = req.headers.authToken;
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
    console.log(user)
  });
};


