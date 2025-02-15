import Image from "next/image";
import { useRouter } from "next/router";
import Style from "./ImageCard.module.css";

const ImageCard = ({ userImage, name, coverImage, description }) => {
	const router = useRouter();

	const handleClick = () => {
		router.push({
			pathname: "blog/Blog",
			query: { userImage, name, coverImage, description },
		});
	};

	return (
		<div className={Style.mainContainer} onClick={handleClick}>
			<div className={Style.userDetails}>
				<Image
					className={Style.usrimg}
					src={userImage}
					width={40}
					height={40}
					alt="User Profile"
					style={{ borderRadius: "50%" }}
				/>
				<h2>{name}</h2>
			</div>
			<div className={Style.contentDetails}>
				<Image
					className={Style.uploadImg}
					src={coverImage}
					width={150}
					height={150}
					alt="Cover Image"
				/>
				<p>{description}</p>
			</div>
		</div>
	);
};

export default ImageCard;
