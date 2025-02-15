import React, { useContext } from "react";
import Style from "./LoadImages.module.css";
import { ChatAppContext } from "../../Context/ChatAppContext";
import Post from "../UploadImage/Post/Post";

const LoadImages = () => {
  const { IMAGES } = useContext(ChatAppContext);

  return (
    <div className={Style.imageGallery}>
      <h2 className={Style.galleryTitle}>Uploaded Images</h2>
      
      <div className={Style.imageGrid}>
        {IMAGES && IMAGES.length > 0 ? (
          IMAGES.map((img, key) => (
            <Post
              key={key}
              Style={Style.PostStyle}
              name={img.author}
              img={`https://gateway.pinata.cloud/ipfs/${img.hash}`} 
              caption={img.description}
              tip={img.tipAmount}  
              id={img.id}
            />
          ))
        ) : (
          <p className={Style.noImages}>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default LoadImages;
