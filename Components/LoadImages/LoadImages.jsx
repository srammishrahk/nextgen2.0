import ImageCard from "../ImageCard/ImageCard";
import Style from "./LoadImages.module.css"; // Ensure styles are imported
import accName from "../../assets/accountName.png"
import send from "../../assets/send.png"
const LoadImages = () => {
	// Dummy Data
	const IMAGES = [
		{
			id: 1,
			author: "Alice",
			userImage: accName,
			coverImage:send,
			description: "This is a beautiful sunset 🌅",
		},
		{
			id: 2,
			author: "Bob",
			userImage: accName,
			coverImage:send,
			description: "Amazing mountain view! 🏔️",
		},
		{
			id: 3,
			author: "Charlie",
			userImage: accName,
			coverImage: send,
			description: "City skyline at night 🌃",
		},
	];

  return (
		<div className={Style.imageGallery}>
			{IMAGES.map((img) => (
				<ImageCard
					key={img.id}
					userImage={img.userImage}
					name={img.author}
					coverImage={img.coverImage}
					description={img.description}
				/>
			))}
		</div>
	);
};

export default LoadImages;
