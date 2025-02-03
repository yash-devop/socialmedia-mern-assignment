import express from "express";
import multer from "multer";
import { Post } from "../models/PostModel";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3, deleteObjectS3, getObject } from "../utils/s3";

export const postRouter = express.Router();

// S3 file upload configuration
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Create a post with image (using S3 and Multer)
postRouter.post("/", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  let imageUrl = null;
  let fileKey = null;
  try {
    if(req.file){
      console.log('req.file is here: ',req.file);
      fileKey = `${uuidv4()}_${req.file.originalname}`;
      await uploadToS3({
        data: req.file.buffer,
        contentType: req.file.mimetype,
        key: fileKey, 
      });
    }
    // Here, we create the post with the image URL
    const newPost = new Post({
      title,
      description,
      imageUrl,
      imageKey: fileKey,
      user: req.user?._id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// Read All Posts
postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profilePicture");

    for(let post of posts){
      if(post.imageKey){
        post.imageUrl = await getObject({
          key: post.imageKey as string    // TODO
        })
      }
    }

    res.status(200).json({
      posts,
      message:
        posts.length > 0 ? "Posts fetched successfully." : "No posts found.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Read Single Post
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});

postRouter.get("/user/:name", async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user?._id
    }).populate("user","name profilePicture createdAt _id");
    
    if (!posts) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    for(let post of posts){
      if(post.imageKey){
        post.imageUrl = await getObject({
          key: post.imageKey as string    // TODO
        })
      }
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});
// Update Post
postRouter.put("/:id", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    post.title = title || post.title;
    post.description = description || post.description;

    if (req.file) {
      // Upload the new image to S3 and get the URL
      const fileKey = req.file.originalname;
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      post.imageUrl = imageUrl;
    }

    await post.save();
    res.status(200).json({post, message: "Post Edited successfully !"});
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// Delete Post
postRouter.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Delete the image from S3 if it exists
    if (post.imageUrl) {
      const fileKey = post.imageUrl.split("/").pop();
      if (fileKey) {
        await deleteObjectS3({ key: fileKey });
      }
    }

    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

export default postRouter;
