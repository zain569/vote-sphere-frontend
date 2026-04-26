import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./component/navbar";
import Vote_UI from "./component/vote_ui";
import Login from "./component/login";
import Register from "./component/register";
import Ask_Question from "./component/askquestion";
import Logout from "./component/logout";
import { useState, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import My_Question from "./component/myQuestion";

function App() {
  const [user, setUser] = useState({ name: "", islogined: false, id: "" });

  useEffect(() => {
    async function checkUser() {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (savedUser && savedUser.name) {
        setUser(savedUser);
      } else {
        setUser({ name: "", islogined: false, id: "" });
      }
    }
    checkUser();
  }, [setUser]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Vote_UI />} />
        <Route path="/login" element={user.islogined ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user.islogined ? <Navigate to="/" /> : <Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/askquestion/:id" element={<Ask_Question />} />
        <Route path="/myquestions/:id" element={<My_Question />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
