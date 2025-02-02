import "./Create.css";
// import userPost from "../Images/a.jpg";
import deleteImg from "../../Asset/delete.svg";
import createImg from "../../Asset/gallery.svg";
import defaultImage from "../../Asset/Book study.jpg"; // Import the default image
import { useState } from "react";
import Header from "../../Containers/Header/Header";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



function Create() {
  const [imageURL, setImage] = useState(""); // State for uploaded image
  const [isLoading, setIsLoading] = useState(false);
  const [blogText, setBlogText] = useState("")
  const [blogTitle, setBlogTitle] = useState("")
  const [File, setSelectedFile] = useState(null);
  const { currentUser } = useUser();
  const navigate = useNavigate()


  // Handle image removal
  const handleRemoveImage = () => {
    setImage(null); // Reset the image state
  };



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Update the image state
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const handleImageUpload = async () => {
    const storage = getStorage(); // Initalize Firebase Storage
    const storageRef = ref(storage, `blogs/${File.name}`); // Create a reference to the image

    try {
      // Upload the File to Firebase Storage
      const snapshot = await uploadBytes(storageRef, File);

      // Get the image URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(imageURL)
      return downloadURL; // Return the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  };

  const HandleUploadBlog = async () => {
    setIsLoading(true);
    const Test = await handleImageUpload()
    console.log(Test)
    try {
      // Validate inputs
      if (!Test || !blogTitle) {
        toast.error("All fields are required");
        setIsLoading(false);
        return;
      }
      // Prepare blog data
      const form = {
        image: Test,
        title: blogTitle,
        authId: currentUser?.uid || "unknown",
        desc: blogText,
        likes: [],
        date: new Date(),
        isVerified: false,
      };

      // Upload blog data to Firestore
      await addDoc(collection(db, "Blogs"), form);

      toast.success("Blog uploaded successfully"); 
      
      navigate("/")
    } catch (error) {
      console.error("Error uploading blog:", error.message);
      toast.error("Failed to upload blog. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };



  return (
    <div className="Create-container">
      <Header />
      <div className="Create">
        <div className="full-container">
          <div className="real-container">
            <div className="img-container">
              {/* Display uploaded or default image */}
              <div className="sides">

                <img
                  src={imageURL || defaultImage}
                  alt="Uploaded Preview"
                  className="preview-img"
                />
              </div>

              {/* Upload button */}
              <div className="sides">

                <div className="choose-file">
                  <label htmlFor="file">Add Image</label>
                  <img src={createImg} alt="Upload Icon" />
                  {/* <button> */}

                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}// Attach handler
                  />
                  {/* </button> */}
                </div>
                <div className="choose-file">
                  <label onClick={handleRemoveImage}>Remove</label>
                  <img src={deleteImg} alt="Delete Icon" />
                </div>
              </div>

            </div>

            {/* Remove button */}

            {/* Input fields */}

            <div className="input-field">
              <label htmlFor="title">Content Title</label>
              <br />
              <textarea id="title" onChange={(e) => setBlogTitle(e.target.value)} ></textarea>
              <br />
              <label htmlFor="content">Content Blog</label>
              <br />
              <textarea id="content" onChange={(e) => setBlogText(e.target.value)}></textarea>
              <button onClick={HandleUploadBlog} >{isLoading ? "Loading" : "Publish"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
