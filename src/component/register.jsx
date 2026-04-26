import { useContext, useState } from "react";
import styles from "../style/register.module.css"
import { registerUser } from "../api/register";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUserName] = useState("");

    const [loading, setLoading] = useState(false)

    const [emailError, setEmailError] = useState(false);
    const [usernamealreadyTaken, setUserNameAlreadyTaken] = useState(false);
    const [emailAlreadyTaken, setEmailAlreadyTaken] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [loginBtnError, setLoginBtnError] = useState(true);

    const navigate = useNavigate();

    const { setUser} = useContext(UserContext);

    function handleLoginBtnError() {
        if (email === "" || password === "" || confirmPassword === "" || username === "") {
            setLoginBtnError(true);
        } else {
            setLoginBtnError(false);
        }
    }

    function handleInput() {
        let isValid = true;

        if (email === "") {
            setEmailError(true);
            isValid = false;
        } else {
            setEmailError(false);
        }

        if (password === "") {
            setPasswordError(true);
            isValid = false;
        } else {
            setPasswordError(false);
        }

        if (confirmPassword === "" || password !== confirmPassword) {
            setConfirmPasswordError(true);
            isValid = false;
        } else {
            setConfirmPasswordError(false);
        }

        if (username === "") {
            setUsernameError(true);
            isValid = false;
        } else {
            setUsernameError(false);
        }

        setLoginBtnError(!isValid);

        return isValid;
    }

    async function handleRegister(e) {
        e.preventDefault();

        let allOK = handleInput();

        if (allOK) {
            try {
                setLoading(true);
                const data = await registerUser({
                    username: username,
                    email: email,
                    password: password
                })

                if (data.userExist) {
                    setEmailAlreadyTaken(true);
                } else {
                    setEmailAlreadyTaken(false);
                }

                if (data.userNameTaken) {
                    setUserNameAlreadyTaken(true);
                } else {
                    setUserNameAlreadyTaken(false);
                }

                if (data.success) {
                    localStorage.setItem("islogined", JSON.stringify(true));
                    localStorage.setItem("username", data.username);

                    setUser({ name: data.username, islogined: true, id: data.id });
                    navigate("/");
                    setLoading(false);
                } else {
                    localStorage.setItem("islogined", JSON.stringify(false));
                    setLoading(false);
                }
            } catch (err) {
                console.log("Failed to Register:", err);
                setLoading(false);
            }
        } else {
            console.log("Failed To register Check all Fields");
        }
    }

    return (
        <>
            <div className={styles.loginOuterdiv}>
                <div className={styles.loginInnerdiv}>
                    <div className={styles.loginHeader}>
                        <h1>VoteSphere</h1>
                        <p>Join VoteSphere to participate</p>
                    </div>
                    <div className={styles.loginForm}>

                        {/*Username Input*/}
                        <label htmlFor="password">Create Username:</label>
                        <br />
                        <input type="text" id="username" required placeholder="Enter Username:" onChange={(e) => {
                            setUserName(e.target.value);
                            setUsernameError(false);
                            handleLoginBtnError();
                        }} />
                        <p style={{ display: usernameError ? "block" : "none" }}>**Please Enter User Name**</p>
                        <p style={{ display: usernamealreadyTaken ? "block" : "none" }}>**UserName Already Taken Try Different UserName**</p>

                        {/*Email Input*/}
                        <label htmlFor="email">Email:</label>
                        <br />
                        <input type="email" id="email" placeholder="Enter Email:" required onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(false);
                            handleLoginBtnError();
                        }} />
                        <p style={{ display: emailError ? "block" : "none" }}>**Enter Email**</p>
                        <p style={{ display: emailAlreadyTaken ? "block" : "none" }}>Email you Enter is already registered</p>

                        {/*Password Input*/}
                        <label htmlFor="password">Password:</label>
                        <br />
                        <input type={showPassword ? "text" : "password"} id="password" required placeholder="Enter Password:" onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                            handleLoginBtnError();
                        }}

                            onDoubleClick={() => {
                                setShowPassword(!showPassword);
                            }} />
                        <p style={{ display: passwordError ? "block" : "none" }}>**Enter Password**</p>

                        {/*Confirm Password Input*/}
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <br />
                        <input type={showPassword ? "text" : "password"} id="confirmPassword" required placeholder="Confirm Password:" onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordError(false);
                            handleLoginBtnError();
                        }}

                            onDoubleClick={() => {
                                setShowPassword(!showPassword);
                            }} />
                        <p style={{ display: confirmPasswordError ? "block" : "none" }}>**Your Password Not Match**</p>

                        <button onClick={handleRegister} disabled={loading} style={{ opacity: loginBtnError ? 0.1 : 1 }} type="submit">{loading ? "Registring..." : "Register"}</button>

                        <p className={styles.registerLink}><span>Already Have Account? </span><a href="/login">Login</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;