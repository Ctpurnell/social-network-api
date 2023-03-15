const { User, Thought } = require('../models');

const allUsers = async () =>
  User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);


    module.exports = {
        getUsers(req, res) {
          User.find()
            .then(async (users) => res.json(users))
            .catch((err) => {
              console.log(err);
              return res.status(500).json(err)
        });
      },
          
              

        getSingleUser(req, res) {
          User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then(async (users) =>
              !users
                ? res
                    .status(404)
                    .json({ message: 'User not found'})
                : res.json({
                    users,
                    allUsers: await allUsers(),
                  })
            )
            .catch((err) => {
              console.log(err);
              return res.status(500).json(err);
            });
        },
      
        createUser(req, res) {
          User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
        },
      
        updateUser(req, res) {
          User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true }
          )
            .then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: 'User not found' })
                : res.json({ user: 'User Added' })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        },
      
        deleteUser(req, res) {
          User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: 'User not found' })
                : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then((thought) =>
              !thought
                ? res
                    .status(404)
                    .json({ message: 'User deleted' })
                : res.json({
                    message: 'User deleted',
                  })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        },
      
        addFriend(req, res) {
          User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: [req.params.friendId] } },
            { runValidators: true, new: true }
          )
            .then((friend) =>
              !friend
                ? res.status(404).json({
                    message: 'No friend with that ID found',
                  })
                : res.json(friend)
            )
            .catch((err) => res.status(500).json(err));
        },
      
        removeFriend(req, res) {
          User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: [req.params.friendId] } },
            { runValidators: true, new: true }
          )
            .then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: 'User not found' })
                : res.json({ user: 'Friend deleted' })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        },
      };
      