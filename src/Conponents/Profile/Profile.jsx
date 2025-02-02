import { useEffect, useState } from "react";
import "./Profile.css";
import back from '../../Asset/upload.svg'
import profileImg from '../../Asset/profile.svg'
import del from "../../Asset/delete.svg"
import logout from '../../Asset/logout.svg'
import save from '../../Asset/save.svg'
import Settings from '../../Asset/Setting.svg'
import { Link, useNavigate } from "react-router-dom";
import { Users } from "../../Context/data";
import { useUser } from "../../Context/UserContext";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut, updateProfile } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db } from "../../Context/Firebase";
function Profile() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [User, setUser] = useState(false);
  const navigate = useNavigate()
  console.log(currentUser)

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: currentUser?.displayName,
    email: currentUser?.email,
    password: "",
    profilePicture: profileImg,
  });


  useEffect(() => {
    setIsLoading(true);

    // Query the Firebase "orders" collection
    const q = query(collection(db, "Users"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let foundOrder = null;
      querySnapshot.forEach((doc) => {
        console.log(doc.data().uid)
        if (doc.data().uid === currentUser?.uid) {
          foundOrder = { ...doc.data(), id: doc.id };
        }
      });
      setUser(foundOrder);
      setIsLoading(false);
    });

    return () => unsub(); // Clean up the listener
  }, [currentUser?.uid]);



  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };


  console.log(User)
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }

    const storage = getStorage();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error('No user is signed in.');
      return;
    }

    const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
      },
      (error) => {
        console.log(error);
        toast.error('Error');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateProfile(user, { photoURL: downloadURL })
            .then(() => {
              toast.success("profile uploaded")
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
  };

  const handleDeletePicture = () => {
    setUserData((prev) => ({
      ...prev,
      profilePicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGEtXj2vHkAYO6ZMiL9HtU6zdEaMXjVy_dqvcDbZuv7KVd_1c&s",
    }));
  };

  const handleSave = async () => {
    const DName = userData.name
    // Perform save operation (e.g., send data to the backend)
    console.log(userData.name)
    if (userData.name !== currentUser?.displayName) {
      await updateProfile(currentUser, {
        displayName: DName,
      });
      await updateDoc(doc(db, "Users", currentUser?.uid), {
        name: DName,
      });
      setIsEditing(false);
    }

    alert("Profile updated successfully!");
  };

  const handleDeleteAccount = async () => {
    const Password = window.prompt("Enter password to delete account")
    console.log(Password)
    const user = currentUser;

    if (user) {
      try {
        // Password verification before deletion
        const credential = EmailAuthProvider.credential(user.email, Password);
        await reauthenticateWithCredential(user, credential); // Reauthenticate user
        await UpdateUserStatus()
        // Proceed with account deletion
        await user.delete();
        console.log('Account deleted successfully');
        alert("Account Deleted redirecting..")
        navigate("/")
      } catch (error) {
        console.error('Error deleting account:', error.message);
        alert(error.message)
      }
    } else {
      setError('User not authenticated.');
    }


  };


  const handleLogOut = async () => {
    await signOut(auth);

    navigate("/")
  }
  return (
    <div className="profile-container">
      <div className="goBack">
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
          </ul>
        </nav>

      </div>
      <div className="profile-header">
        <div className="profile-picture">
          <img className="gg" src={userData.profilePicture} alt="Profile" />
          {isEditing && (
            <>
              <label htmlFor="file">Upload Image  <img src={back} alt="" /></label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="file-input"
              />
              <button
                type="button"
                onClick={handleDeletePicture}
                className="delete-picture-button"
              >
                Remove Image
                <img src={del} alt="" />
              </button>
            </>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="input-field"
              />

              <button className="save-button" onClick={handleSave}>
                Save
                <img src={save} alt="" />
              </button>
            </>
          ) : (
            <div>
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <button className="edit-button" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="profile-details">
        <h2>Profile Details</h2>
        <ul>
          <li>
            <strong>UserName:</strong> {currentUser?.displayName}
          </li>
          <li>
            <strong>Email:</strong> {currentUser?.email}
          </li>
          <li>
            <strong>Joined:</strong>

            <span>{new Date(User.RegisteredTime).toLocaleString()}</span>
          </li>
        </ul>
      </div>
      <div className="profile-actions">
        <button className="delete-button" onClick={handleDeleteAccount}>
          Delete Account
          <img src={del} alt="" />
        </button>
        <button onClick={handleLogOut} className="logout-button">Log Out  <img src={logout} alt="" /></button>


      </div>
    </div>
  );
}

export default Profile;
