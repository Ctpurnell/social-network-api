const router = require("express").Router();

const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend

} = require("../../controllers/userController");

router.route("/").get(getUsers).post(createUser); //api/users

router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser); //api/users/:id

router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend); //api/users/:id/friends/:friendId

module.exports = router;
