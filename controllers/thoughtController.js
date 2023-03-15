const { Thought, User } = require("../models");

module.exports = {

  getThoughts(req, res) {
    Thought.find()
    .then(async (thoughts) => res.json(thoughts))
    .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'Error: no thought!' })
          : User.findOneAndUpdate(
              { userId: req.body.userId },
              { $push: { thought: { thought: thoughts.thoughtText } } },
              { runValidators: true, new: true }
            )
      )

      .then((user) =>
        !user
          ? res.status(404).json({ message: 'User not found' })
          : res.json({ thought: 'Thought created' })
      )
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
      .then(async (thoughts) => 
      !thoughts
      ? res 
       .status(404)
       .json({ message: 'No thought found'})
       : res.json({
        thoughts,
       }))
       .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
       });
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { thoughtId: req.params.thoughtId },
      { thoughtText: req.body.thoughtText, username: req.body.username },
      { runValidators: true, new: true }
    )
      .then((thoughts) =>
        !thoughts
          ? res
              .status(404)
              .json({ message: 'Thought not found' })
          : res.json({ thought: 'Thought updated' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

     
  deleteThought(req, res) {
    Thought.findOneAndDelete({ thoughtId: req.params.thoughtId })
      .then(() => res.json({ message: 'thought deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { thoughtId: req.params.thoughtId },
      { $addToSet: { reactions: [ req.body ] } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({
            message: 'No thought with that ID' })
          : res.json({ thought: 'Reaction has been added' })
      )
      .catch((err) => res.status(500).json(err));
  },

  
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { thoughtId: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => 
      !thought
          ? res
              .status(404)
              .json({ message: 'Thought not found!' })
          : res.json({ thought: 'Reaction Deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
