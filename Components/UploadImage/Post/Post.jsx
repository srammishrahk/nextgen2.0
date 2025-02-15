import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";

import Style from "./Post.module.css";
import images from "../../../assets";
import { ChatAppContext } from "../../../Context/ChatAppContext";

const Post = ({
    key,
    name,
    img,
    caption,
    tip,
    id
}) =>{

    const{tipImageOwner, userName, getUsername} = useContext(ChatAppContext);

    const tipImage =  async (event) => {
       
        // const id = event.target.id;
        // console.log(id);
        // const k = event.target.key;
        // console.log(k.toNumber());
        await tipImageOwner({id});

    };
   

    return(
        <div className={Style.Post}>

                <div className={Style.Chat_user_info}>
                    <Image src={images.accountName} alt="image" width={70} height={70} />
                    <div className={Style.Chat_user_info_box}>
                        <h4>{key}</h4>
                        <p className={Style.show}>{name}</p>
                    </div>
                </div>
                <div className={Style.post_image}>
                    <img src={img} />
                </div>
                <div className={Style.Chat_box_left}>
                    <p>{caption}</p>
                    {/* <button>TIP</button> */}
                </div>
                <div className={Style.tip}>
                    <p>TIP : {tip.toNumber()}</p>
                    <button onClick={tipImage}>TIP</button>
                </div>

            
        </div>
    );
};

export default Post;