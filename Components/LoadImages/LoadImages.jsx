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
      <h2 className={Style.galleryTitle}>Uploaded Images</h2>
      
      <div className={Style.imageGrid}>
        {IMAGES && IMAGES.length > 0 ? (
          IMAGES.map((img, key) => (
            <Post
              key={key}
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
