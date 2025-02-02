import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { Post } from "../models/PostModel";
import { v4 as uuidv4 } from "uuid";
import {
  uploadToS3,
  deleteObjectS3,
  getObject
} from "../utils/s3";
import { s3Client } from "../config/aws";

export const postRouter = express.Router();

// S3 file upload configuration
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME!,
    // acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `posts/${Date.now()}_${file.originalname}`);
    },
  }),
});

// Create a post with image (using S3 and Multer)
postRouter.post("/", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "Image is required" });
    return;
  }

  try {
    const fileKey = `posts/${uuidv4()}_${req.file.originalname}`;
    const imageUrl = await uploadToS3({
      data: req.file.buffer, // The file buffer from multer
      contentType: req.file.mimetype, // The file's MIME type
      key: fileKey, // Unique key for S3
    });

    const newPost = new Post({
      title,
      description,
      imageUrl,
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
    const posts = await Post.find();
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
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
      const fileKey = `posts/${uuidv4()}_${req.file.originalname}`;
      const imageUrl = await uploadToS3({
        data: req.file.buffer, // The file buffer from multer
        contentType: req.file.mimetype, // The file's MIME type
        key: fileKey, // Unique key for S3
      });
      post.imageUrl = imageUrl;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
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

    // Delete the image from S3
    const fileKey = post.imageUrl.split("/").pop(); // Assuming image URL contains the key
    if (fileKey) {
      await deleteObjectS3({key: fileKey});
    }

    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

// Get a signed URL for uploading images to S3 (optional: use this for client-side image uploads)
postRouter.get("/upload-url", async (req, res) => {
  const { fileName, contentType } = req.query;

  if (!fileName || !contentType) {
    res.status(400).json({ message: "File name and content type are required" });
    return;
  }

  try {
    const key = `posts/${uuidv4()}_${fileName}`;
    const signedUrl = await getObject({
        key
    })
    res.status(200).json({ signedUrl });
  } catch (error) {
    res.status(500).json({ message: "Error generating signed URL", error });
  }
});

export default postRouter;

