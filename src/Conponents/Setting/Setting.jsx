import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated import
import "./Setting.css";
import profilePic from '../../Asset/Book study.jpg';
import setting from '../../Asset/setting.svg';
import edit from '../../Asset/edit.svg';
import back from '../../Asset/arrow_back.svg';

function Settings() {
  const navigate = useNavigate(); // Updated to useNavigate
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(profilePic);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProfileSave = () => {
    setIsEditing(false);
    alert("Settings will automatically change");
    // Handle saving the profile data (e.g., update the state or make an API call)
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="aside">
          <img className="back" src={back} alt="Back" onClick={() => navigate(-1)} /> {/* Updated to use navigate */}
          <div className="setting-head">
            <h1>Settings</h1>
            <img src={setting} alt="Settings" />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="section">
          <h2 className="PI">Personal Information</h2>
          <div className="profile-info">
            <img
              src={profilePicUrl}
              alt="Profile"
              className="profile-pic"
            />
            <div className="edit-profile-pic" onClick={() => document.getElementById('fileInput').click()}>
              <img src={edit} alt="Edit" />
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
              />
            ) : (
              <p className="User-name" style={{ fontWeight: 'bold' }}>{username}</p>
            )}
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            ) : (
              <p>{email}</p>
            )}
            <div className="section">
              {isEditing ? (
                <div className="password-change">
                  <h2>Change Password</h2>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Current Password"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                  />
                  <button  style={{color: "white"}} onClick={togglePasswordVisibility}>
                    {showPassword ? "Hide" : "Show"} Password
                  </button>
                </div>
              ) : (
                <p></p>
              )}
            </div>

            {isEditing ? (
              <button style={{color: "white", outline: "none"}} onClick={handleProfileSave}>Save Changes</button>
            ) : (
              <button style={{color: "white", outline: "none"}}className="editButton" onClick={() => setIsEditing(true)}> <p>Edit profile</p> <img className="pen" src={edit} alt="" /></button>
            )}
          </div>
        </div>

        {/* Notification Settings Section */}
        <div className="sectional">
          <h2>Notification Settings</h2>
          <label>
            <input type="checkbox" /> Enable Email Notifications
          </label>
          <br />
          <label>
            <input type="checkbox" /> Enable Push Notifications
          </label>
        </div>

        {/* Account Settings Section */}
        <div className="section DeleteAccount">
          <h2>Account Settings</h2>
          <button className="delete" onClick={() => alert("Account deleted successfully")}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;