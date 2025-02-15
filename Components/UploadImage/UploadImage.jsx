import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import {create} from "ipfs-http-client";
// import Identicon from 'identicon.js';

//INTERNAL IMPORT
import Style from "./UploadImage.module.css";
import images from "../../assets";
import { ChatAppContext } from "../../Context/ChatAppContext";
import Post from "./Post/Post"

const projectId = '2NAhigzPTk81FkTA9UV1DHgtH9S';
const projectSecret = '77bd323fa9e15b873c0aac101c1915b8';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


// const ipfsClient = require("ipfs-http-client")
//Declare IPFS
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers: {  authorization: auth,}}) // leaving out the arguments will default to these values


const UploadImage = () => {

    const [loading, setLoading] = useState(false);
    const{uploadImage} = useContext(ChatAppContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [description ,setDescription] = useState(null);
    const fileInput = useRef(null);
    const [imageBuffer, setImageBuffer] = useState(null);
    const [imgHash, setImgHash] = useState(null);
    const [imgDes, setImgDes] = useState(null);
    const [imgs, setImages] = useState([]);

    const{loadImage,IMAGES} = useContext(ChatAppContext);

    // const images = loadImage();
    // console.log(images);


    const handleFileInputChange =  (e) => {
        setSelectedFile(e.target.files[0]);
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = event.target.result;
            setImageBuffer(buffer);           
        };
        reader.readAsArrayBuffer(file);
        console.log(JSON.stringify(Array.from(new Uint8Array(imageBuffer))))        
    };

    const submitImage =  async () => {
       
        const result = await ipfs.add(imageBuffer);
        setImgHash(result.path);
        setImgDes(description);
        console.log(String(result.path));
        console.log(String(description));

        console.log(imgHash);
        console.log(imgDes);
        const res = await uploadImage({imgHash:String(result.path), description:String(description)});
        console.log(res.toNumber());

    };

    const nullStyles = {
      all: 'unset',
    };

    return(
        <div>
            {/* {IMAGES && <p>JSON.stringify(Array.from(new Uint8Array(IMAGES)))</p>} */}
            <div className = {Style.UploadImage}>
            
                <div className={Style.UploadImage_box}>
                    <div className={Style.UploadImage_box_left}>
                        <div className={Style.UploadImage_box_left_select_btn}>
                            <input type="file" id="file-input" accept=".jpg, .jpeg, .png, .bmp, .gif" ref={fileInput} style={{ display: "none" }} onChange={handleFileInputChange} />
                            <button onClick={() => fileInput.current.click()}>
                                {""}
                                <Image src={images.create} alt="send" width={30} height={30} />
                                {""}
                                Select Image
                            </button>
                            {selectedFile && <p>Selected file: {selectedFile.name}</p>}                            
                        </div>
                        <div className={Style.UploadImage_box_left_discription}>
                            <input  type="text"
                                    placeholder="Enter Discription" 
                                    onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className={Style.UploadImage_box_right}>
                        <button onClick={submitImage}>Submit</button>                        
                    </div>
                </div>
            </div>
            <div className={Style.Friend}>
              <div className={Style.Friend_box}>
              
                  {IMAGES && IMAGES.map((img, key) => (
                    <div className={Style.Friend_box_left}>
                    <Post          
                      key={key}
                      name = {img.author}
                      img = {`https://projectdecentragram.infura-ipfs.io/ipfs/${img.hash}`}
                      caption = {img.description}
                      tip = {img.tipAmount}  
                      id = {img.id}                   
                    />
                    </div> 
                  ))} 
                 
                
              </div>
            </div>
            {/* <div style={nullStyles}>
                    {IMAGES && IMAGES.map((img, key) => (
                                <li key={key}> <img src={`https://projectdecentragram.infura-ipfs.io/ipfs/${img.hash}`} style={{ maxWidth: '420px'}}/>
                                </li>
                    
                    <div className="Style.Post" key={key} >
                    <div className="Style.post-header">
                      <img
                        className='Style.profile-pic'
                        width='30'
                        height='30'
                        src={Image.logo}
                      />
                      <small className="Style.name">{img.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="Style.post-image"><img src={`https://projectdecentragram.infura-ipfs.io/ipfs/${img.hash}`} style={{ maxWidth: '420px'}}/></p>
                        <p className="Style.caption">{img.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(img.tipAmount.toString(), 'Ether')} ETH
                          TIPS
                        </small>
                        <button
                          className="likes"
                          name={img.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div class="social-feed" key={key}>
                  <div class="post">
                    <div class="user-info">
                      <img class="profile-pic" src={Image.logo} alt="Profile Picture"/>
                      <h2 class="name">{img.author}</h2>
                    </div>
                    <img class="post-image" src={`https://projectdecentragram.infura-ipfs.io/ipfs/${img.hash}`} alt="Post Image"/>
                    <div class="likes">
                      <span class="like-count">50 likes</span>
                    </div>
                  </div>
                </div>             
                ))}




            </div> */}
            
        </div>
    );
};

export default UploadImage;