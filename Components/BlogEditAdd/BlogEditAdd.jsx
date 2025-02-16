

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import UploadImage from "../UploadImage/UploadImage";
import UploadImageStyle from "../UploadImage/UploadImage.module.css";
import { uploadToPinata } from "../UploadImage/uploadToPinata";
import Style from "./BlogEditAdd.module.css";
import Image from "next/image";
import images from "../../assets";

// Dynamically import Jodit Editor (only runs in the browser)
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BlogEditAdd = ({ blog }) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const fileInput = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isClient, setIsClient] = useState(false);
	const editor = useRef(null);

	useEffect(() => {
		setIsClient(true); // Ensure this component is client-side
	}, []);

	const handleFileInputChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const showContent = async () => {
		console.log(content);
		const blob = new Blob([content], { type: "text/html" });
		const htmlFile = await submitContentToIpfs(blob);
		console.log(htmlFile);
	};

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
		} else {
			alert("File upload failed!");
		}
	};

	const validateFields = () => {
		return title.trim() !== "" && content.trim() !== "" && selectedFile;
	};

	const submitBlog = () => {
		if (validateFields()) {
			console.log("Blog submitted successfully");
		} else {
			alert("Please fill in all fields before submitting.");
		}
	};

	const config = useMemo(
		() => ({
			readonly: false,
			placeholder: "Start typing...",
			height: 600
		}),
		[]
	);

	return (
		<div className={Style.BlogEditAdd}>
			{/* <h2>{blog ? "Edit Blog" : "Add Blog"}</h2> */}

			<input
				type="text"
				placeholder="Blog Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			{isClient && (
				<JoditEditor
					className={Style.jodit}
					ref={editor}
					value={content}
					config={config}
					tabIndex={1}
					onBlur={(newContent) => setContent(newContent)}
					onChange={() => {}}
				/>
			)}
				{/* <button className={Style.actionButton} onClick={showContent}>
					Show Content
				</button> */}

				<input
					type="file"
					accept=".jpg, .jpeg, .png, .bmp, .gif"
					ref={fileInput}
					style={{ display: "none" }}
					onChange={handleFileInputChange}
				/>

				<button
					className={Style.uploadButton}
					onClick={() => fileInput.current.click()}
				>
					<Image src={images.create} alt="send" width={20} height={20} />
					Add Cover Image
				</button>

				{selectedFile && (
					<p className={Style.selectedFile}>
						Selected file: {selectedFile.name}
					</p>
				)}

				<button className={Style.submitButton} onClick={submitBlog}>
					{blog ? "Update Blog" : "Add Blog"}
				</button>
			</div>
	);
};

export default BlogEditAdd;
