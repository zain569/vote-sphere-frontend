export const loginUser = async (loginData) => {
    try {
        let res = await fetch("https://bobtail-t-shirt-siesta.ngrok-free.dev/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(loginData)
        })

        res = await res.json();

        return res
    } catch (err) {
        console.log(err);
    }
}