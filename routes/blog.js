const path = require("path");

const { Router } = require("express");
const router = Router();
const cloudinary=require('cloudinary').v2;


const Blog = require("../models/blog");
const Comment = require("../models/comment");
const upload=require("../middlewares/multer");

          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME , 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});


router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});


router.post("/", upload.single('coverImage'),async (req,res) => {
  const { title, body} = req.body;

  // Upload the image to Cloudinary
  // const coverImage=req.files.coverImage;
  try{
    const result = await cloudinary.uploader.upload(req.file.path);
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: result.secure_url, // Use the secure_url provided by Cloudinary
    });
  
    return res.redirect(`/blog/${blog._id}`);s

  }
  catch(error){
    console.log("error",error);
  }

});

module.exports = router;
