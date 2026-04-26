export const GetQuestion = async () => {
    try {
        let response = await fetch("https://votesphere-gfor.onrender.com/api/questions/getallquestions", {
            method: "GET",
            credentials: "include"
        })

        response = await response.json();
        return response;
    } catch (err) {
        console.error("Error fetching questions:", err); throw err;
    }
}