export const registerUser = async (userData) => {
    try{
        let res = await fetch("https://bobtail-t-shirt-siesta.ngrok-free.dev/api/auth/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userData)
        })

        res = await res.json();
        return res;
    } catch (err) {
        console.log("Failed to Register:", err);
    }
}