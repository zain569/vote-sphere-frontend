import { useContext, useState } from "react";
import style from "../style/askquestion.module.css"
import { PostQuestion } from "../api/postquestion";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Ask_Question() {

    const [data, setData] = useState({
        question: "",
        optionA: "",
        optionB: "",
    })

    const {user} = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if(!user.islogined){
            setMessage("Please login to post a question.");
            return;
        }

        setLoading(true);

        if(!data.question || !data.optionA || !data.optionB){
            setMessage("Please fill all the fields");
            setLoading(false)
            return;
        }

        try{
            // Call the API to post the question
            let response = await PostQuestion({
                question: data.question,
                options: [{text: data.optionA}, {text: data.optionB}]
            });

            console.log(response);
            
            
            if(response.success){
                setMessage("Question posted successfully!");
                setLoading(false);
                navigate('/');
            } else {
                setLoading(false);
                setMessage(response.message);
                return;
            }

            navigate("/");
        } catch (error) {
            console.error("Error posting question:", error);
            setLoading(false);
            setMessage("Failed to post question.");
        }
    }
    return (
        <>
            <div className={style.outer_div}>
                <div className={style.inner_div}>
                    <div className={style.heading}>
                        <h3>Ask Question on Vote Sphere</h3>
                        <p>platform to ask question and get answer from the community. You can ask any question related to voting, elections, political parties, candidates, policies, and more. Join the discussion and share your thoughts with others!</p>
                    </div>
                    <div className={style.question_form}>
                        <h4>Question Details</h4>

                        {/* //Question form will be here */}
                        <label className={style.question_label} htmlFor="question">New Question:</label>
                        <textarea className={style.question_input} name="question" onChange={(e) => {setData({...data, question: e.target.value})}} id="question" cols="30" rows="100" placeholder="Type your question here..."></textarea>

                        <label htmlFor="optionA" className={style.question_label}>Option A:</label>
                        <input type="text" onChange={(e) => {setData({...data, optionA: e.target.value})}} className={style.question_option} id="optionA" placeholder="Type option A here..." />

                        <label htmlFor="optionB" className={style.question_label}>Option B:</label>
                        <input type="text" onChange={(e) => {setData({...data, optionB: e.target.value})}} className={style.question_option} id="optionB" placeholder="Type option B here..." />

                        <p className={style.err_message_p}>{message}</p>

                        <button className={style.button} onClick={handleSubmit}>
                            {loading ? "Posting..." : "Post Question"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Ask_Question;