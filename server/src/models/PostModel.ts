import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    imageKey: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
