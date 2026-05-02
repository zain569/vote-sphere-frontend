export const GetQuestion = async () => {
    try {
        let response = await fetch("https://bobtail-t-shirt-siesta.ngrok-free.dev/api/questions/getallquestions", {
            method: "GET",
            credentials: "include"
        })

        response = await response.json();
        return response;
    } catch (err) {
        console.error("Error fetching questions:", err); throw err;
    }
}