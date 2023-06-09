const router = require('express').Router();

const {
    getThoughts,
    getSingleThought, 
    createThought,
    updateThought,
    deleteThought,
    addReaction, 
    removeReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought); //   /api/thoughts

router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought); //   /api/thoughts/:id

router.route('/:thoughtId/reactions').post(addReaction).delete(removeReaction); //        /api/thoughts/:thoughtId/reactions

module.exports = router;