import mongoose from "mongoose";

const UserModelSchema = new mongoose.Schema({
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },{
    timestamps: true    // shows created and updated At
  })


export const User = mongoose.model("User",UserModelSchema)   