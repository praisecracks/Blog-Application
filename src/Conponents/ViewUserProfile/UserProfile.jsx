import React from 'react'
import "../ViewUserProfile/UserProfile.css"
import back from "../../Asset/arrow_back.svg"
import { useNavigate } from "react-router-dom"; // Updated import
import profile from "../../Asset/profile.svg"
import info from '../../Asset/eye.svg'

function UserProfile() {
      const navigate = useNavigate(); // Updated to useNavigate
    
  return (
    <div>
      <div className="Userprofile">
      <img src={back} alt="Back" className="back-button" onClick={() => navigate(-1)} />
      </div>

      <div className="view-userContainer">

      <div className="A-User-profile">
        <img src={profile} alt="" />
      </div>

      <div className="A-User-Details">
      <div className="additional-info">
      <p><strong>Username:</strong> Durotoluwa Praise</p>
            <p><strong>Email:</strong> john.doe@example.com</p>
            <p><strong>Position:</strong> Sudent or admin</p>
          </div>
      </div>
      </div>
      <div className="notice-info">
        <img src= {info} alt="" />
        This info is credential. Kept....
      </div>
    </div>
  )
}

export default UserProfile
