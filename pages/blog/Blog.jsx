import React from "react";
import Image from "next/image";
import Style from "./Blog.module.css";
import accountName from "../../assets/accountName.png";
import send from "../../assets/send.png";

const Blog = () => {
	const blogData = {
        author: "Alice",
        title:"The Beauty of Sunsets",
		authorImage: accountName,
		coverImage: send,
		description: `Sunsets are nature’s way of reminding us to slow down and appreciate the beauty around us. The golden hues blending into shades of pink and purple create a breathtaking masterpiece in the sky.

There’s something peaceful about watching the sun dip below the horizon, reflecting on the day’s moments, and embracing the stillness of the evening. Whether it's by the ocean, in the mountains, or in a bustling city, sunsets have a magical way of bringing calmness to our souls.

What’s your favorite place to watch the sunset? 🌇`,
	};

	return (
		<div className={Style.blogContainer}>
			<div className={Style.imgbox}>
				<Image
					className={Style.blogimg}
					src={blogData.coverImage}
					alt="Blog Cover"
					width={600}
					height={400}
				/>
			</div>
			<div className={Style.writer}>
				<div className={Style.backdes}>
                    <Image
                        className={Style.wrimg}
						src={blogData.authorImage}
						alt="Author Profile"
						width={50}
						height={50}
					/>
					<h4>{blogData.author}</h4>
				</div>
			</div>
			<div className={Style.blogcontent}>
				<p>{blogData.description}</p>
			</div>
		</div>
	);
};

export default Blog;
