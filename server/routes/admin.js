const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getStats, getUsers, deleteUser,
  getAllPosts, deletePost, makeAdmin
} = require('../controllers/adminController');

router.get('/stats', auth, admin, getStats);
router.get('/users', auth, admin, getUsers);
router.delete('/users/:id', auth, admin, deleteUser);
router.put('/users/:id/make-admin', auth, admin, makeAdmin);
router.get('/posts', auth, admin, getAllPosts);
router.delete('/posts/:id', auth, admin, deletePost);

module.exports = router;