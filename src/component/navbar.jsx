import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../style/navbar.module.css"
import { UserContext } from "../context/UserContext";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user } = useContext(UserContext);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <div className={styles.navbar_outer_div}>
                <div className={styles.name}>VoteSphere</div>

                <button
                    type="button"
                    className={styles.menu_toggle}
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`${styles.navbar_links_div} ${isMenuOpen ? styles.navbar_links_open : ""}`}>
                    <div className={styles.primary_links_row}>
                        <NavLink className={({ isActive }) => isActive ? styles.navlinks_active : styles.navlinks} to="/" onClick={closeMenu}>Home</NavLink>
                        <NavLink className={({ isActive }) => isActive ? styles.navlinks_active : styles.navlinks} to={`/myquestions/${user.id}`} onClick={closeMenu}>My Questions</NavLink>
                    </div>

                    <div className={styles.login_register_div}>
                        {
                            user.islogined ? (
                                <p className={styles.username_p}>{user.name}</p>
                            ) : (
                                <>
                                    <NavLink className={({ isActive }) => isActive ? styles.navlinks_active : styles.navlinks} to="/login" onClick={closeMenu}>Login</NavLink> |
                                    <NavLink className={({ isActive }) => isActive ? styles.navlinks_active : styles.navlinks} to="/register" onClick={closeMenu}>Register</NavLink>
                                </>
                            )
                        }
                        <div className={styles.logout_div}>
                            {
                                user.islogined ? (
                                    <>
                                        <NavLink className={({ isActive }) => isActive ? styles.navlinks_active : styles.navlinks} to="/logout" onClick={closeMenu}>Logout</NavLink>
                                    </>
                                ) : (
                                    //nothing to show when user is not logined
                                    <p></p>
                                )
                            }
                        </div>
                    </div>

                    <div className={styles.ask_question_div}>
                        <NavLink className={({ isActive }) => isActive ? styles.navlinks_active : styles.navlinks} to={`/askquestion/${user.id}`} onClick={closeMenu}>Ask Question</NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;
