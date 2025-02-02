import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Edit.css";
import backImg from '../../Asset/arrow_back.svg';
import blog from '../../Asset/Book study.jpg';

function Edit() {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        console.log('File selected:', file); // Debug log
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            console.log('File read result:', reader.result); // Debug log
            setUserData((prev) => ({ ...prev, profilePicture: reader.result }));
        };
        reader.readAsDataURL(file);
    }
}

    return (
        <div>
            <div className="topSection">
                <div className="Leave">
                    <img src={backImg} alt="" onClick={() => navigate(-1)} />
                    <button>Save Changes</button>
                </div>
                <div className="edit-container">
                    <div className="image-edit">
                        <img src={userData.profilePicture || blog} alt="" /> 
                        <input 
                            type="file" 
                            name="file" 
                            id="file" 
                            accept='image/*' 
                            onChange={handlePictureChange} 
                            style={{ display: 'none' }} 
                        />
                        <button style={{ outline: "none", cursor: "pointer", color: "White" }}>
                            <label htmlFor="file">
                                Change Image
                            </label>
                        </button>
                    </div>

                    <div className="blog-edit">
                        <div className="blog-body">
                            <h2>Title of the Blog</h2>
                            <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae molestiae nisi id modi, corrupti adipisci ea, fugit, minus suscipit fugiat sapiente aspernatur deserunt quo. Expedita quae similique, debitis esse saepe at accusantium quos quis dignissimos repellendus dolorum rerum dolore tempora odit perferendis placeat vero, delectus iusto molestias accusamus facilis? Ratione eligendi aut dolor praesentium commodi tempora voluptatibus, odit fugit et molestias inventore adipisci. Ad repellendus officia ipsa temporibus distinctio consectetur explicabo fugiat, pariatur saepe quam, quo quos rem eius aliquam illo, harum optio dolor dolorem corrupti accusamus quasi. Corrupti, quo iste sunt aperiam tempore ullam in? Ex quaerat itaque architecto esse! Cupiditate perferendis eligendi sed laboriosam dolore ducimus necessitatibus quas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit;