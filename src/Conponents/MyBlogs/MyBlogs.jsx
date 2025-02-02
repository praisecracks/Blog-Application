import { useState, useEffect } from "react";
import "./MyBlogs.css";
import srch from '../../Asset/search.svg'
import edit from '../../Asset/editWhite.png'
import del from '../../Asset/delete.svg'
import like from '../../Asset/userLike.png'
import { Link } from "react-router-dom";
import Footer from "../../Containers/Footer/Footer";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import useDeletePost from "../../Hooks/UseDeleteHook";
import { useUser } from "../../Context/UserContext";
function MyBlogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState();
  const { deletePost, loading, error } = useDeletePost();
  const { currentUser } = useUser();
  const Auth_id = currentUser.uid
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

  const SingleBlogs = Data?.filter(function (e) {
    return e.authId === Auth_id;
  });

  console.log(Data)
  console.log(SingleBlogs)

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const result = await deletePost(postId);
    if (result.success) {
      alert("Post deleted successfully!");
    }
  };
  const handleEdit = () => {
    alert("Update on it way you will be able to edit blogs in a bit ")
  }




  return (
    <div className="MyBlogs">
      {/* Header Section */}
      <div className="head">
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
          </ul>
        </nav>
        <div className="div">
          <h5>My Blogs</h5>
        </div>

        <div className="srch">
          <input
            type="text"
            placeholder="Search blogs..."
          />
        </div>
      </div>

      {/* Blog List Section */}
      <div className="mid">
        <div className="blogs-list">
          {SingleBlogs && SingleBlogs.length > 0 ? (
            SingleBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                {
                  blog.image &&
                  <div className="image-connect"><img src={blog.image} alt="" /></div>
                }
                <h2>{blog.title}</h2>
                <p>
                  {blog.date instanceof Timestamp
                    ? blog.date.toDate().toLocaleString() // Convert Firebase Timestamp to JavaScript Date
                    : "No Date Available"} {/* Fallback if no date is provided */}
                </p>
                <p className="blog-text">{blog.desc}</p>

                <div className="actions">
                  {/* <button>View <img src={view} alt="" /></button> */}
                  <button onClick={() => handleEdit()}>Edit <img src={edit} alt="" /></button>
                  <button onClick={() => handleDelete(blog.id)}>Delete <img src={del} alt="" /></button>
                  
                </div>
              </div>
            ))
          ) : (
            <p className="no-blogs"> {isLoading ? "Loading...." : "No blogs found."}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyBlogs;
