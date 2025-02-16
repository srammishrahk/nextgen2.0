import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

// INTERNAL IMPORT
import {
  ChechIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userLists, setUserLists] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Fetch Data on Load
  const fetchData = async () => {
    try {
      const contract = await connectingWithContract();
      const connectAccount = await connectWallet();

      console.log("connected account", connectAccount);
      setAccount(connectAccount);

      const userData = await contract.userList(connectAccount);
      setUserName(userData.name);
      setProfileImage(userData.profileImageHashcode);
    } catch (error) {
      console.log(error);
    }
  };

  // Create Account
  const createAccount = async ({ name, profileHash, preferences }) => {
    try {
      const contract = await connectingWithContract();
      const createUser = await contract.createAccount(name, profileHash, ["1"]);

      setLoading(true);
      await createUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account, please try again.");
      console.error(error);
    }
  };

  // Create Blog Post
  const createBlog = async ({
    contentHash,
    blogCoverHash,
    title,
    category,
  }) => {
    try {
      const contract = await connectingWithContract();
      const addBlog = await contract.createBlog(
        contentHash,
        blogCoverHash,
        title,
        category
      );

      setLoading(true);
      await addBlog.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating the blog, please try again.");
    }
  };

  // Load Blogs
  const loadBlogs = async () => {
    try {
      if (!account || !ethers.utils.isAddress(account)) {
        // setError("Invalid wallet address. Please reconnect your wallet.");
        console.error("Error: Invalid or empty account:", account);

        const contract = await connectingWithContract();
        const connectAccount = await connectWallet();

        console.log("connected account", connectAccount);
        setAccount(connectAccount);

        if (!account || !ethers.utils.isAddress(account)) {
          console.error("Error: Invalid or empty account:", account);
          setError("Error: Invalid or empty account");
          return;
        }
      }

      const contract = await connectingWithContract();
      console.log("Fetching blogs for account:", account); // Debugging
      const userBlogs = await contract.getUserBlogs(account);
      setBlogs(userBlogs);
    } catch (error) {
      setError("Error while fetching blogs, please reload.");
      console.error("Error while fetching blogs:", error);
    }
  };

  // Vote on Blog
  const voteOnBlog = async ({ blogId, approve }) => {
    try {
      const contract = await connectingWithContract();
      const vote = await contract.voteOnBlog(blogId, approve);
      setLoading(true);
      await vote.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while voting, please try again.");
    }
  };

  // Tip Blog Author
  const tipBlogAuthor = async ({ blogId }) => {
    try {
      const contract = await connectingWithContract();
      const tip = await contract.tipBlogAuthor(blogId, {
        value: ethers.utils.parseEther("0.01"),
      });
      setLoading(true);
      await tip.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while tipping, please try again.");
    }
  };

  // Add Comment to Blog
  const addComment = async ({ blogId, commentText }) => {
    try {
      const contract = await connectingWithContract();
      const comment = await contract.addComment(blogId, commentText);

      setLoading(true);
      await comment.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while adding comment, please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (account) {
      loadBlogs();
    }
  }, [account]);

  return (
    <ChatAppContext.Provider
      value={{
        createAccount,
        createBlog,
        loadBlogs,
        voteOnBlog,
        tipBlogAuthor,
        addComment, // Newly added function
        connectWallet,
        ChechIfWalletConnected,
        account,
        userName,
        profileImage,
        userLists,
        blogs,
        loading,
        error,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
