import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import UploadImage from "../UploadImage/UploadImage";
import UploadImageStyle from "../UploadImage/UploadImage.module.css";
import { ChatAppContext } from "../../Context/ChatAppContext";
import Style from "./BlogEditAdd.module.css";
import Image from "next/image";
import images from "../../assets";
import { uploadToPinata } from "../UploadImage/uploadToPinata";
// Dynamically import Jodit Editor (only runs in the browser)
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BlogEditAdd = ({ blog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fileInput = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgHash, setImgHash] = useState(null);
  const editor = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const handleFileInputChange = (e) => {
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);

  };


  const showContent= async () =>{
      console.log(content);
      const blob = new Blob([content], { type: "text/html" });
      const htmlFile= await submitContentToIpfs(blob);
      console.log(htmlFile);
    }

  const submitContentToIpfs = async (file) => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    console.log("Uploading to Pinata...");
    const ipfsHash = await uploadToPinata(file);

    if (ipfsHash) {
      console.log("Content uploaded to IPFS: ", ipfsHash);
      return ipfsHash;

      // Call your backend or smart contract function
      //await uploadImage({ imgHash: ipfsHash, description });
    } else {
      alert("File upload failed!");
    }
  };
  useEffect(() => {
    setIsClient(true); // Ensure this component is client-side
  }, []);

  const validateFields = () => {
    if((title!=null && title!="" ) && (content!=null && content != "") && selectedFile){
      return true;
    }
    return false;
  }


  const submitBlog = () => {
    if(validateFields()){
      console.log(true);
    }
  }
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  return (
    <div className={Style.BlogEditAdd}>
      <h2>{blog ? "Edit Blog" : "Add Blog"}</h2>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      {isClient && (
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
          onChange={(newContent) => {}}
        />
      )}
       <button onClick={showContent}>
    Click Here to Show Content 
    </button>
    <br></br>
    <input
            type="file"
            accept=".jpg, .jpeg, .png, .bmp, .gif"
            ref={fileInput}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
      />
      <button  onClick={() => fileInput.current.click()}>
        <span className={UploadImageStyle.UploadImage_btn}> 
        <Image src={images.create} alt="send" width={20} height={20} />
        Select Image
        </span>
        
      </button>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      <button onClick={submitBlog}>{blog ? "Update Blog" : "Add Blog"}</button>
    </div>
  );
};

export default BlogEditAdd;
