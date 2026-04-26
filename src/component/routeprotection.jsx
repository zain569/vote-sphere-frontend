function RouteRerender({ setUsername, setislogined }) {
    setUsername(localStorage.getItem("username"));

    const loginedStatus = localStorage.getItem("islogined");
    if (loginedStatus) {
        setislogined(true);
    } else {
        setislogined(false);
    }
}

export default RouteRerender;