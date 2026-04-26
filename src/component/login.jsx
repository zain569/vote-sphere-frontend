import { useContext, useState } from "react";
import styles from "../style/login.module.css"
import { loginUser } from "../api/login";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loginBtnError, setLoginBtnError] = useState(true);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { setUser } = useContext(UserContext);

    function handleLoginBtnError() {
        if (email === "" || password === "") {
            setLoginBtnError(true);
        } else {
            setLoginBtnError(false);
        }
    }

    function handleinput(e) {
        e.preventDefault();
        let isValid = true;
        if (email === "") {
            setEmailError(true);
            setLoginBtnError(true);
            isValid = false
        } else {
            setEmailError(false);
            setLoginBtnError(false);
            isValid = true
        }
        if (password === "") {
            setPasswordError(true);
            setLoginBtnError(true);
            isValid = false
        } else {
            setPasswordError(false);
            setLoginBtnError(false);
            isValid = true;
        }

        return isValid;
    }

    async function handleLogin(e) {
        e.preventDefault();

        const allOk = handleinput(e)

        if(allOk){
            // console.log("Login successfully with", email, password);
            try{
                setLoading(true);
                const data = await loginUser({
                    email: email,
                    password: password,
                })

                if(data.success){
                    setMessage(data.message);
                    localStorage.setItem("islogined", JSON.stringify(true));
                    localStorage.setItem("username", data.username);

                    setUser({ name: data.username, islogined: true, id: data.id });
                    navigate("/");
                } else {
                    setMessage(data.message);
                    localStorage.setItem("islogined", JSON.stringify(false));
                }
                setLoading(false )
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Login False");
        }
    }
    return (
        <>
            <div className={styles.loginOuterdiv}>
                <div className={styles.loginInnerdiv}>
                    <div className={styles.loginHeader}>
                        <h1>VoteSphere</h1>
                        <p>Welcome Back</p>
                    </div>
                    <div className={styles.loginForm}>
                        <label htmlFor="email">Email:</label>
                        <br />
                        <input type="email" id="email" placeholder="Enter Email:" required onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(false);
                            handleLoginBtnError();
                        }} />
                        <p style={{ visibility: emailError ? "visible" : "hidden" }}>**Enter Email**</p>

                        <label htmlFor="password">Password:</label>
                        <br />
                        <input type="password" id="password" required placeholder="Enter Password:" onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                            handleLoginBtnError();
                        }} />
                        <p style={{ visibility: passwordError ? "visible" : "hidden" }}>**Enter Password**</p>

                        <p>{message}</p>

                        <button onClick={handleLogin} style={{ opacity: loginBtnError ? 0.1 : 1 }} type="submit">{loading? "Logining..." : "Login"}</button>

                        <p className={styles.registerLink}><span>Don't have an account? </span><a href="/register">Register</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login; 