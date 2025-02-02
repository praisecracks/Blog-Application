import { useEffect, useState } from "react";
import "./Admin.css";
import back from '../../Asset/arrow_back.svg'
import img from '../../Asset/Book study.jpg'
import { Blogs } from "../../Context/data";
import { Link } from "react-router-dom";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";

function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "Blogs"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const StreamArray = [];
      querySnapshot.forEach((doc) => {
        StreamArray.push({ ...doc.data(), id: doc.id });
      });
      setData(StreamArray);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const pendingPosts = Data.filter(post => !post.isVerified);
  const acceptedPosts = Data.filter(post => post.isVerified);

  const [selectedPost, setSelectedPost] = useState(null);

  const handleApprove = async (postId) => {
    const orderRef = doc(db, "Blogs", postId);
    const currentOrder = pendingPosts.find((post) => post.id === postId);

    if (!currentOrder) {
      toast.error(`Post with ID ${postId} does not exist.`);
      return;
    }

    const newStatus = !currentOrder.isVerified;

    await updateDoc(orderRef, { isVerified: newStatus });
  };

  const handleReject = (postId) => {
    alert(`Post ${postId} rejected!`);
    setSelectedPost(null);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="admin-dashboard">
      <img className="adminBack" src={back} alt="" onClick={() => navigate(-1)} />
      <button className="TooglMode" onClick={toggleTheme}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
      <h1 id="dash" style={{ backgroundColor: theme === 'light' ? 'white' : 'inherit', color: theme === 'light' ? 'black' : 'white' }}>Admin Dashboard</h1>

      <nav>
        <ul>
          <li>
            {/* <Link to="/admin">Admin Home</Link> */}
          </li>
          <li>
            {/* <Link to="/adminform">Create Admin </Link> */}
          </li>
        </ul>
      </nav>
      <div className="dashboard-container">


        <div className="flexex">
          
        <div className="pending-posts">
          <h2>Pending Posts</h2>
          {pendingPosts.length > 0 ? (
            <ul>
              {pendingPosts.map((post) => (
                <li key={post.id} className="post-item">
                  <img src={post.image} alt={post.title} className="post-image" />
                  <div className="post-info">
                    <h3>{post.title}</h3>
                    <button onClick={() => handleViewPost(post)} className="view-button">View Content</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-pending">No pending posts.</p>
          )}
        </div>
        <div className="post-details">
          {selectedPost ? (
            <div className="details-card">
              <h2 style={{position: "relative"}}>Post Details</h2>
              <img src={selectedPost.image} alt={selectedPost.title} className="details-image" />
              <h3>{selectedPost.title}</h3>
              <p style={{ textAlign: "left" }} className="pend-content">{selectedPost.desc}</p>
              <div className="action-buttons">
                <button onClick={() => handleApprove(selectedPost.id)} className="approve-button">Approve</button>
                <button onClick={() => handleReject(selectedPost.id)} className="reject-button">Reject</button>
              </div>
            </div>
          ) : (
            <p>Select a post to view details.</p>
          )}
        </div>

          </div>



        <div className="accepted-posts">
          <h2>Accepted Posts</h2>
          {acceptedPosts.length > 0 ? (
            <ul>
              {acceptedPosts.map((post) => (
                <li key={post.id} className="post-item">
                  <img src={post.image} alt={post.title} className="post-image" />
                  <div className="post-info">
                    <h3>{post.title}</h3>
                    <button onClick={() => handleViewPost(post)} className="view-button">View Content</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-accepted">No accepted posts.</p>
          )}
        </div>
      
      </div>
    </div>
  );
}

export default Admin;