import React, { useState, useEffect, useContext } from "react";
//INTRNAL IMPORT
import {Sidebar, LoadImages } from "../Components/index";
import Style from "../styles/feed.module.css"
const feed = () => {
  return (
    <div className={Style.feedcontainer}>
      {/* <UploadImage/> */}
      <LoadImages />
      <Sidebar/>
    </div>
  );
};

export default feed;