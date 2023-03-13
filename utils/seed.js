const { User, Thought } = require('../models');
const { usernames, email, thoughts } = require('./data');
const connection = require('../config/connection');


connection.on("error", (err) => err);
connection.once("open", async () => {
  console.log("connected");

  
  await User.deleteMany({});  // delete a user
  await Thought.deleteMany({});  //delete thought

  const users = [];
  const userThoughts = [];

  
  for (let i = 0; i < usernames.length; i++) {
    const userObj = {
      username: usernames[i],
      email: email[i],
    };
    const newUser = await User.create(userObj);
    users.push({
      _id: newUser._id.toString(),
      username: newUser.username,
    });
  }

  for (let i = 0; i < thoughts.length; i++) {
    const thoughtsObj = {
      username: usernames[i],
      thoughtText: thoughts[i],
    };
    const newThought = await Thought.create(thoughtsObj);
    userThoughts.push({
      _id: newThought._id.toString(),
      username: newThought.username,
    });
  }

  for (let i = 0; i < userThoughts.length; i++) {
    const userId = users.filter(
      (user) => user.username === userThoughts[i].username
    );
    console.log('User Id', userId);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId[0]._id },
      { $push: { thoughts: userThoughts[i]._id } },
      { new: true }
    );
    console.log(updatedUser);
  }

    process.exit(0);


});