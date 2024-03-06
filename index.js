
require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const bodyParser=require('body-parser');


const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;


mongoose
  // .connect(process.env.MONGO_URL)
  .connect("mongodb+srv://tusharchawla2002:ib5rqHdCYpYd5eAV@blogscluster.3xecoum.mongodb.net/?retryWrites=true&w=majority")

  .then((e) => console.log("MongoDB Connected"));

  // mongodb://127.0.0.1:27017/blogify
  // mongoose.set('strictQuery', false);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(bodyParser.urlencoded({extended:true}));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
