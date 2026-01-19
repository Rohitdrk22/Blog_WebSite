import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"
import methodOverride from "method-override";


const app = express();
const port = process.env.PORT || 3000;;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data.json");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));




//---------------------------------Login and register data.json file code---------------------------------
const readData = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};



//---------------------------------Blog read and write blog_data.json file code---------------------------------
const BLOG_FILE = path.join(__dirname, "blog_data.json");

const readBlogs = () => {
  return JSON.parse(fs.readFileSync(BLOG_FILE, "utf-8"));
};

const writeBlogs = (data) => {
  fs.writeFileSync(BLOG_FILE, JSON.stringify(data, null, 2));
};



//---------------------------------Login Page--------------------------------- 
//Login page Rout
app.get("/", (req, res) => {
  res.render("login", { message: "" });
});

  
//Login page for registered user
app.post("/login", (req, res) => {
  let { username, password } = req.body;

  username = username.toLowerCase(); // convert input to lowercase
  const data = readData();

  const user = data.users.find(
    u => u.username.toLowerCase() === username && u.password === password
  );

  if (!user) {
    return res.render("login", {
      message: "Invalid username or password"
    });
  }

  res.redirect("/home");
});




//---------------------------------Register page---------------------------------
//Register page Rout
app.get("/register", (req, res) => {
  res.render("register", { message: "" });
});

//Register page for registring the user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const data = readData();

  const exists = data.users.find(u => u.username === username);
  if (exists) {
    return res.render("register", {
      message: "User already exists"
    });
  }

  data.users.push({ username, password });
  writeData(data);

  res.render("login", {
    message: "User registered successfully"
  });
});



//---------------------------------Home Page of the Website---------------------------------
app.get("/home", (req, res) => {
  const blogData = readBlogs();

  const authors = [...new Set(blogData.blogs.map(b => b.author))];

  res.render("index.ejs", {blogs: blogData.blogs, authors
  });
});



//---------------------------------Blog section--------------------------------- 
app.get("/blog", (req, res)=>{
  res.render("blog.ejs");
});


//Blog post method
app.post("/blog", (req, res) => {
  const { title, content, author } = req.body;

  const blogData = readBlogs();

  blogData.blogs.push({
    id: Date.now(),
    title,
    content,
    author,
    createdAt: new Date().toISOString()
  });

  writeBlogs(blogData);

  res.redirect("/home");
});

//Blog put / update method
app.put("/blog/:id", (req, res) => {
  const { title, content } = req.body;
  const blogId = Number(req.params.id);

  const blogData = readBlogs();

  const blog = blogData.blogs.find(b => b.id === blogId);
  if (!blog) return res.send("Blog not found");

  blog.title = title;
  blog.content = content;

  writeBlogs(blogData);
  res.redirect("/viewBlogs");
});

// View-Blog section 
app.get("/viewBlogs", (req, res) => {
  const data = readBlogs();

  const blogs = [...data.blogs].reverse(); // last → first

  res.render("viewBlogs.ejs", { blogs });
});


//Delete blog
app.delete("/blog/:id", (req, res) => {
  const blogId = Number(req.params.id);
  const data = readBlogs();

  data.blogs = data.blogs.filter(blog => blog.id !== blogId);

  writeBlogs(data);
  res.redirect("/viewBlogs");
});



//---------------------------------About section---------------------------------
app.get("/about", (req, res)=>{
  res.render("about.ejs");
});



//---------------------------------Contact section---------------------------------
app.get("/contact", (req, res)=>{
  res.render("contact.ejs");
});


//---------------------------------Users detial section---------------------------------
app.get("/users", (req, res) => {
  const data = readData();
  res.render("users.ejs", { users: data.users });
});

app.delete("/users/:username", (req, res) => {
  const data = readData();

  data.users = data.users.filter(
    u => u.username !== req.params.username
  );

  writeData(data);
  res.redirect("/users");
});





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
