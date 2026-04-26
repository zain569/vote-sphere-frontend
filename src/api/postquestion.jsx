export const PostQuestion = async (askQuestionData) => {
    try{
        let res = await fetch("https://votesphere-gfor.onrender.com/api/questions/createquestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: askQuestionData.question,
                options: askQuestionData.options,
            }),
            credentials: "include"
        });
        let response = await res.json();
        return response;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}