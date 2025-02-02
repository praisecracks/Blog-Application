import { useState, useEffect } from "react";
import "./userBlog.css";
import './UserBlog.css'
// import srch from '../Images/search.svg'
// import connect from '../Images/Book study.jpg'
import like from '../../Asset/userLike.png'
import Header from "../../Containers/Header/Header";
import { Blogs } from "../../Context/data";
import { useParams } from "react-router";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import useLikePost from "../../Hooks/HandleLike";
import { useUser } from "../../Context/UserContext";

function userBlog() {
  const params = useParams(); // Extract the order ID from URL params
  const id = params.id; // Extract the order ID from URL params
  const [data, setData] = useState()
  const { currentUser } = useUser();
  console.log(data)

  useEffect(() => {

    // Query the Firebase "orders" collection
    const q = query(collection(db, "Blogs"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let foundOrder = null;
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          foundOrder = { ...doc.data(), id: doc.id };
        }
      });
      setData(foundOrder);
      console.log(foundOrder.date.seconds)
    });

    return () => unsub(); // Clean up the listener
  }, [id]);
  // const date = 
  const date = new Date(data?.date?.seconds * 1000 + data?.date?.nanoseconds / 1e6);
  // console.log(date)\


  const { likes, loading, likePost, fetchLikes } = useLikePost(data?.id, currentUser && currentUser.uid);

  useEffect(() => {
    fetchLikes(); // Fetch initial likes when the component mounts
  }, [fetchLikes]);



  return (
    <div className="userBlog">
      {/* Header Section */}
      <Header />
      {/* Blog List Section */}
      <div className="mid">
        <div className="blogs-list">

          <div key={data?.id} className="blog-card">
            <div className="image-connect"><img src={data && data.image} alt="" /></div>
            <h2>{data?.title}</h2>
            <p>{date?.toLocaleString()}</p>
            <p className="blog-text">{data?.desc}</p>

            <div className="actions">

              <button onClick={likePost} disabled={loading || likes.includes(currentUser && currentUser.uid)}>
                {likes.includes(currentUser && currentUser.uid) ? "Liked" : "Like"} ({likes.length})

                <img src={like} alt="" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default userBlog;
