"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express3 = __toESM(require("express"), 1);
var import_passport3 = __toESM(require("passport"), 1);
var import_express_session = __toESM(require("express-session"), 1);

// src/config/db.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var import_dotenv = require("dotenv");
(0, import_dotenv.config)({
  path: ".env"
});
console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
var connectMongoDB = async () => {
  try {
    await import_mongoose.default.connect(process.env.DATABASE_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("connection error in mongodb: ", error);
  }
};

// src/routes/AuthRoutes.ts
var import_express = __toESM(require("express"), 1);
var import_passport = __toESM(require("passport"), 1);

// src/config/constants.ts
var FRONTEND_URL = "http://localhost:5173";

// src/routes/AuthRoutes.ts
var authRouter = import_express.default.Router();
authRouter.get(
  "/google",
  import_passport.default.authenticate("google", {
    scope: ["profile", "email"]
  })
);
authRouter.get(
  "/google/callback",
  import_passport.default.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/home`,
    failureRedirect: `${FRONTEND_URL}/login2`
  }),
  (req, res) => {
    res.redirect(301, `${FRONTEND_URL}/home`);
  }
);
authRouter.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({
      message: "Please login first."
    });
  }
  res.json(req.user);
});
authRouter.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
    });
  } else {
    res.status(200).json({ message: "No active session to log out" });
  }
});

// src/config/passport.ts
var import_dotenv2 = require("dotenv");
var import_passport2 = __toESM(require("passport"), 1);
var import_passport_google_oauth20 = require("passport-google-oauth20");

// src/models/UserModel.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var UserModelSchema = new import_mongoose2.default.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
  // shows created and updated At
});
var User = import_mongoose2.default.model("User", UserModelSchema);

// src/config/passport.ts
(0, import_dotenv2.config)({
  path: ".env"
});
console.log(" process.env.GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
import_passport2.default.use(new import_passport_google_oauth20.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : "",
        profilePicture: profile.photos ? profile.photos[0].value : ""
      });
      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      done(error, void 0);
    }
  }
));
import_passport2.default.serializeUser((user, done) => {
  console.log("user in serialize", user);
  done(null, user.id);
});
import_passport2.default.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// src/server.ts
var import_cors = __toESM(require("cors"), 1);
var import_dotenv4 = require("dotenv");
var import_connect_mongo = __toESM(require("connect-mongo"), 1);

// src/routes/PostRoutes.ts
var import_express2 = __toESM(require("express"), 1);
var import_multer = __toESM(require("multer"), 1);

// src/models/PostModel.ts
var import_mongoose3 = __toESM(require("mongoose"), 1);
var postSchema = new import_mongoose3.default.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String
    },
    imageKey: {
      type: String
    },
    user: {
      type: import_mongoose3.default.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
var Post = import_mongoose3.default.model("Post", postSchema);

// src/routes/PostRoutes.ts
var import_uuid = require("uuid");

// src/utils/s3.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
var import_dotenv3 = require("dotenv");
(0, import_dotenv3.config)({
  path: ".env"
});
var bucketName = process.env.AWS_BUCKET_NAME;
var bucketRegion = process.env.AWS_REGION;
var accesskey = process.env.AWS_ACCESS_KEY_ID;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
var s3 = new import_client_s3.S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accesskey,
    secretAccessKey
  }
});
var uploadToS3 = async ({
  data,
  contentType,
  key
}) => {
  const command = new import_client_s3.PutObjectCommand({
    Body: data,
    // Now 'data' is guaranteed to be one of the allowed types
    ContentType: contentType,
    Key: key,
    Bucket: bucketName
  });
  await s3.send(command);
};
var deleteObjectS3 = async ({ key }) => {
  const command = new import_client_s3.DeleteObjectCommand({
    Key: key,
    Bucket: bucketName
  });
  await s3.send(command);
};
var getSignedUrlAWS = async (command, expiresIn = 3600) => {
  return await (0, import_s3_request_presigner.getSignedUrl)(s3, command, { expiresIn });
};
var getObject = async ({
  key
}) => {
  const getCommand = new import_client_s3.GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });
  const signedUrl = await getSignedUrlAWS(getCommand);
  return signedUrl;
};

// src/routes/PostRoutes.ts
var postRouter = import_express2.default.Router();
var storage = import_multer.default.memoryStorage();
var upload = (0, import_multer.default)({ storage });
postRouter.post("/", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  let imageUrl = null;
  let fileKey = null;
  try {
    if (req.file) {
      console.log("req.file is here: ", req.file);
      fileKey = `${(0, import_uuid.v4)()}_${req.file.originalname}`;
      await uploadToS3({
        data: req.file.buffer,
        contentType: req.file.mimetype,
        key: fileKey
      });
    }
    const newPost = new Post({
      title,
      description,
      imageUrl,
      imageKey: fileKey,
      user: req.user?._id
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});
postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profilePicture");
    for (let post of posts) {
      if (post.imageKey) {
        post.imageUrl = await getObject({
          key: post.imageKey
          // TODO
        });
      }
    }
    res.status(200).json({
      posts,
      message: posts.length > 0 ? "Posts fetched successfully." : "No posts found."
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});
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
    }).populate("user", "name profilePicture createdAt _id");
    if (!posts) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    for (let post of posts) {
      if (post.imageKey) {
        post.imageUrl = await getObject({
          key: post.imageKey
          // TODO
        });
      }
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});
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
      const fileKey = req.file.originalname;
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      post.imageUrl = imageUrl;
    }
    await post.save();
    res.status(200).json({ post, message: "Post Edited successfully !" });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});
postRouter.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
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
var PostRoutes_default = postRouter;

// src/middlewares/AuthMiddleware.ts
var authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// src/server.ts
(0, import_dotenv4.config)({
  path: ".env"
});
connectMongoDB();
var app = (0, import_express3.default)();
app.use((0, import_cors.default)({
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:5173"]
}));
app.use(import_express3.default.json());
app.use((0, import_express_session.default)({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1e3,
    // 1 day in milliseconds
    httpOnly: true,
    // for security
    secure: process.env.NODE_ENV === "production",
    // Use secure cookies in production
    sameSite: "strict"
    // same-site behavior
  },
  store: import_connect_mongo.default.create({
    mongoUrl: process.env.DATABASE_URL,
    collectionName: "sessions"
  })
}));
app.use(import_passport3.default.initialize());
app.use(import_passport3.default.session());
var apiRouter = import_express3.default.Router();
app.use("/api", apiRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/posts", authMiddleware, PostRoutes_default);
var PORT = 8e3;
var DOMAIN = process.env.NODE_ENV === "production" ? "prod_url" : `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Server started on ${DOMAIN}`);
});
//# sourceMappingURL=server.cjs.map