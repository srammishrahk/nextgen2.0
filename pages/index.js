import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import {Sidebar, LoadImages } from "../Components/index";
import Style from "../styles/feed.module.css"

const ChatApp = () => {
  // const {} = useContext(ChatAppContext);
  return (
    <div className={Style.feedcontainer}>
      {/* <UploadImage/> */}
      <LoadImages />
      <Sidebar/>
    </div>
  );
};

export default ChatApp;
