import { useContext } from "react";
import style from "../style/logout.module.css"
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Logout() {

    const {setUser} = useContext(UserContext);

    const navigate = useNavigate();

    function handleLogout() {
        setUser({ name: '', islogined: false });
        localStorage.removeItem("islogined");
        localStorage.removeItem("username");
        navigate("/")
    }
    return (
        <>
            <div className={style.logout_div}>
                <button onClick={handleLogout} className={style.logoutButton}>Are you sure you want to logout?</button>
            </div>
        </>
    )
}

export default Logout;