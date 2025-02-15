import React, { useState, useRef, useContext } from "react";
import Image from "next/image";
import Style from "./UploadImage.module.css";
import images from "../../assets";
import { ChatAppContext } from "../../Context/ChatAppContext";
import { uploadToPinata } from "./uploadToPinata"; // Import Pinata function

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const fileInput = useRef(null);
  const [imgHash, setImgHash] = useState(null);
  const { uploadImage } = useContext(ChatAppContext);

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const submitImage = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload!");
      return;
    }

    console.log("Uploading to Pinata...");
    const ipfsHash = await uploadToPinata(selectedFile);

    if (ipfsHash) {
      console.log("Image uploaded to IPFS: ", ipfsHash);
      setImgHash(ipfsHash);

      // Call your backend or smart contract function
      await uploadImage({ imgHash: ipfsHash, description });
    } else {
      alert("File upload failed!");
    }
  };

  return (
    <div>
      <div className={Style.UploadImage}>
        <div className={Style.UploadImage_box}>
          <div className={Style.UploadImage_box_left}>
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .bmp, .gif"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
            <button  onClick={() => fileInput.current.click()}>
              <span className={Style.UploadImage_btn}> 
              <Image src={images.create} alt="send" width={20} height={20} />
              Select Image
              </span>
            </button>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
          </div>

          <div className={Style.UploadImage_box_left_discription}>
            <input
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={Style.UploadImage_box_right}>
            <button onClick={submitImage}>Submit</button>
          </div>
        </div>
      </div>
    <div Style={Style.UploadImage_ImgStyle}>

    {imgHash && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={`https://gateway.pinata.cloud/ipfs/${imgHash}`}
            alt="Uploaded"
            width={300}
          />
        </div>
      )}
    </div>
      
    </div>
  );
};

export default UploadImage;
