export const GetMyQuestions = async () => {
    try {
        let response = await fetch("https://votesphere-gfor.onrender.com/api/questions/myquestions", {
            method: "GET",
            credentials: "include"
        });

        response = await response.json();
        return response;
    } catch (err) {
        console.error("Error fetching my questions:", err);
        throw err;
    }
};
