import React, { useState, useEffect, useContext } from "react";
//INTRNAL IMPORT
import { UploadImage, loadImages } from "../Components/index";

const feed = () => {
  return (
    <div>
      <UploadImage/>
      <loadImages/>
    </div>
  );
};

export default feed;