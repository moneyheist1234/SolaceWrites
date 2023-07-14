

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose =  require('mongoose');

const homeStartingContent = "Welcome to the Blog App! This is a platform where you can share your thoughts, ideas, and experiences with the world. Whether you're a seasoned writer or just starting out, this is the perfect place to express yourself. Explore the diverse collection of blog posts created by our community members and get inspired. If you'd like to contribute, simply create an account and start writing your own blog posts. Join our community today and let your voice be heard!";
const aboutContent = "About Us\n\nWelcome to our blog! We are a passionate team of writers, creators, and thinkers who love sharing our experiences and insights with the world. Our mission is to inspire, inform, and entertain our readers through engaging and thought-provoking content. Whether it's travel, food, technology, or personal development, we cover a wide range of topics to cater to different interests. Join us on this journey as we explore the world and share our stories. We believe that everyone has a unique perspective to offer, so feel free to join our community and start sharing your own thoughts and experiences. Together, let's create a vibrant and supportive space for knowledge exchange and creativity!";
const contactContent = "Contact Us\n\nThank you for visiting our blog! We value your feedback, suggestions, and inquiries. If you have any questions or would like to get in touch with us, please feel free to reach out using the contact information provided below. We appreciate your interest and look forward to hearing from you!";



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

url = 'mongodb://0.0.0.0/blogDB'
mongoose.connect(url);

if(url){
  console.log("connected to DB");
}else{
  console.log("error, not connected");
}


const postSchema  = mongoose.Schema({
  title :String,
  content :String
});

const Post  = mongoose.model("Post",postSchema);



app.get("/", function(req, res){

  Post.find({})
  .then(function(posts){
    res.render("home",{

      startingContent: homeStartingContent,

     posts: posts

    })
  })
  .catch(function(err){
    console.log("error");
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
  .then(function(savedPost){
    console.log("Post saved successfully:", savedPost);
    res.redirect("/");
  })
  .catch(function(err){
    console.log("Error saving post:", err);
   
  });
});


app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findById(requestedPostId)
    .then(function(post) {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      } else {
        console.log("Post not found");
        res.redirect("/");
      }
    })
    .catch(function(err) {
      console.log("Error fetching post:", err);
      res.redirect("/");
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
