const express = require('express');
const { getAllPosts,getPostById,createPost,updatePost, deletePost, likePost, reviewPost} = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/",getAllPosts);
router.get("/:id",getPostById)

router.post("/",authenticate,createPost);
router.put("/:id",authenticate,updatePost);
router.delete("/:id",authenticate,deletePost);

router.post("/:id/like",likePost);
router.post("/:id/review",reviewPost);


module.exports = router;
