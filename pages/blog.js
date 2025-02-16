// App.js or BlogPage.js
import React, { useState } from "react";
import {BlogEditAdd} from "../Components/index"; // Adjust the path as necessary
import Style from "../styles/blog.module.css";
const blogpage = () => {
  const [currentBlog, setCurrentBlog] = useState(""); // For editing an existing blog

  // Example blog data for editing (you can fetch this from your backend)
  const exampleBlog = {
    id: 1,
    title: "Sample Blog Title",
    content: "This is a sample blog content.",
    imgHash: "Qm...yourImageHashHere", // Example IPFS hash
  };

  return (
    <div className={Style.blogmain}>
      <h1>Blog Management</h1>
      <h2>Add Blog</h2>
      <BlogEditAdd blog={currentBlog || exampleBlog} />
      {/* You can set currentBlog to null to create a new blog */}
    </div>
  );
};

export default blogpage;