import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import {
  ChechIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");
  const [IMAGES, setImages] = useState([]);

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
      //GET CONTRACT
      const contract = await connectingWithContract();
      //GET ACCOUNT
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      //GET USER NAME
      const userName = await contract.getUsername(connectAccount);
      setUserName(userName);
      //GET MY FRIEND LIST
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      //GET ALL APP USER LIST
      const userList = await contract.getAllAppUser();
      setUserLists(userList);
    } catch (error) {
      // setError("Please Install And Connect Your Wallet");
      console.log(error);
    }
  };

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      console.log("Currently You Have no Message");
    }
  };

  //CREATE ACCOUNT
  // Create Account
  const createAccount = async ({ name, profileHash, preferences }) => {
    try {
      console.log(
        "name:",
        name,
        "profileHash:",
        profileHash,
        "preferences:",
        preferences
      );

      const contract = await connectingWithContract(); // ✅ Ensure contract is defined

      setLoading(true);
      const transaction = await contract.createAccount(
        name,
        profileHash,
        preferences
      ); // ✅ Corrected
      await transaction.wait(); // ✅ Corrected

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating account:", error); // ✅ Log the error properly
      setError(error.message);
    }
  };

  //ADD YOUR FRIENDS
  const addFriends = async ({ name, userAddress }) => {
    try {
      if (!name || !userAddress) return setError("Please provide data");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(userAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const sendMessage = async ({ msg, address }) => {
    console.log(msg, address);
    try {
      if (!msg || !address) return setError("Please Type your Message");

      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
    }
  };

  //READ INFO
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  //SEND MESSAGE TO YOUR FRIEND
  const uploadImage = async ({ imgHash, description }) => {
    console.log(String(imgHash), String(description));
    try {
      const contract = await connectingWithContract();
      const addImage = await contract.uploadImage(imgHash, description);
      setLoading(true);
      await addImage.wait();
      setLoading(false);
      // window.location.reload();
      const imgCount = await contract.imageCount();
      window.location.reload();
      return imgCount;
    } catch (error) {
      setError("Please reload and try again");
    }
  };

  const loadImage = async () => {
    try {
      const contract = await connectingWithContract();
      const imgCount = await contract.imageCount();
      const imgs = [];
      // console.log(imgCount.toNumber());
      for (var i = 1; i <= imgCount; i++) {
        const image = await contract.images(i);
        // console.log(image.hash);
        // console.log(image.id);
        imgs.push(image);
      }
      setImages(imgs);
      // console.log(IMAGES);
      return imgs;
    } catch (error) {
      setError("hjknkmm");
    }
  };

  const tipImageOwner = async ({ id }) => {
    console.log(id);
    try {
      const contract = await connectingWithContract();
      const imgTip = await contract.tipImageOwner(id);
      // setLoading(true);
      // await imgTip.wait();
      // setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Tipping is not available right now! Try again");
    }
  };

  const getUserName = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    return userName;
  };

  useEffect(() => {
    fetchData();
    loadImage();
    // console.log(IMAGES);
  }, []);

  return (
    <ChatAppContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        ChechIfWalletConnected,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
        uploadImage,
        loadImage,
        IMAGES,
        tipImageOwner,
        getUserName,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
