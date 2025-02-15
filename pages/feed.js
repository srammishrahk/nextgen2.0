import React, { useState, useEffect, useContext } from "react";
//INTRNAL IMPORT
import { UploadImage, LoadImages } from "../Components/index";

const feed = () => {
  return (
    <div>
      <UploadImage/>
      <LoadImages/>
    </div>
  );
};

export default feed;