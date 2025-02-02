import "./Header.css"
import ProfileImage from "../../Asset/white profile.png"
import { Link, NavLink } from "react-router-dom"
import { useUser } from "../../Context/UserContext"
import { Users } from "../../Context/data";
import { useEffect, useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../Context/Firebase";
function Header() {
    const { currentUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [Data, setData] = useState();

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
            setData(foundOrder);
            setIsLoading(false);
        });

        return () => unsub(); // Clean up the listener
    }, [currentUser?.uid]);




    const [isActive, setisActive] = useState(false);
    const handleToggle = () => {
        setisActive((current) => !current);
    };

    const isAdmin = Data && Data.isAdmin
    const isLoggedIn = currentUser && currentUser
    return (
        <div className="HomeHeader">
            <Link to="/"><div className="logo">
                DU_FEED
            </div></Link>
            <button onClick={handleToggle} className="respobutton">
                <BsMenuButtonWide />
            </button>

            <ul style={{ top: `${isActive ? "0px" : "-3550px"}` }} className="headerNav">
                <button onClick={handleToggle} className="respobutton">
                    <BsMenuButtonWide />
                </button>

                <li><NavLink to="/home">Home</NavLink></li>
                {isLoggedIn && <li><NavLink to="/create">Create</NavLink></li>}
                {isLoggedIn && <li><NavLink to="/blogs">My Blogs</NavLink></li>}
                <li><NavLink to="/about">About</NavLink></li>
                {isAdmin &&
                    <li> <NavLink to="/admin">
                        Admin Page
                    </NavLink>
                    </li>
                }
                <li><NavLink to={isLoggedIn ? "setting" : "login"}> {isLoggedIn ?
                    <div className="major">
                        <div className="profile-pic">
                            <img src={ProfileImage} alt="" />
                        </div>

                    </div>
                    :
                    "Login"
                }
                </NavLink></li>
            </ul>
        </div>

    )
}
export default Header