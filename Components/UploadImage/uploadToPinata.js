import axios from "axios";

const PINATA_API_KEY = "b243b3bf5b3f3197637b";
const PINATA_SECRET_API_KEY = "ff5e4f540e232e35d87d4e4bfe84ffb6d6a035fd3d1c58f3f8fc6411ef2cd722";

export const uploadToPinata = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Optional metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      uploadedBy: "YourApp",
    },
  });
  formData.append("pinataMetadata", metadata);

  // Pinata options
  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", options);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    console.log("File uploaded successfully: ", res.data);
    return res.data.IpfsHash; // Returns the IPFS hash
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    return null;
  }
};
