import { useEffect, useState } from "react";
import LikeIcon from "../../Asset/profileFilled.svg"
import { truncate } from "../../Context/data"
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
function ReportContainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [Data, setData] = useState();
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

    console.log(Data)

    // const AllBlogs = Data
    const AllBlogs = Data?.filter(function (e) {
        return e.isVerified === true;
    });
    return (

        <div>
            {
                isLoading ?
                    <div>Loading ...</div> :
                    <div className="report-container">
                        {AllBlogs && AllBlogs.length > 0 ? (

                            AllBlogs.map((data) => {
                                return (
                                    <div key={data.id} className="reports">
                                        <div className="report">
                                            <img src={data.image} alt="" />

                                            <div className="blog-text">
                                                <h1>{data.title}</h1>
                                                <p>
                                                    {truncate(data.desc, 100)}
                                                </p>
                                                <Link to={`/blog/${data.id}`}>
                                                    <button
                                                        className="readmorebutton"
                                                    >
                                                        Read More
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="review">
                                                <div className="like">
                                                    {data.likes.length} Likes
                                                </div>
                                                <img className='r' src={LikeIcon} alt="" />
                                            </div>
                                        </div>

                                    </div>
                                );
                            })
                        ) :
                            <p className="no-blogs">No blogs found.</p>
                        }
                    </div>
            }
        </div>
    )
}

export default ReportContainer