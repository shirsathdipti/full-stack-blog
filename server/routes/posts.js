const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPosts, getPost, createPost,
  updatePost, deletePost, addComment, likePost
} = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/comment', auth, addComment);
router.put('/:id/like', auth, likePost);

module.exports = router;