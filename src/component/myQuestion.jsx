import { useEffect, useState } from "react";
import styles from "../style/vote_ui.module.css";
import { GetMyQuestions } from "../api/getMyQuestionsApi";

function My_Question() {
    const [myQuestions, setMyQuestions] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");

    useEffect(() => {
        const fetchMyQuestions = async () => {
            setIsFetching(true);
            setFetchError("");

            try {
                const data = await GetMyQuestions();
                setMyQuestions(Array.isArray(data) ? data : []);
            } catch (error) {
                setFetchError(error?.response?.data?.message || "Unable to load your questions right now.");
                setMyQuestions([]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchMyQuestions();
    }, []);

    const getPercentage = (optionVotes, totalVotes) => {
        if (totalVotes === 0) return 0;
        return Number(((optionVotes / totalVotes) * 100).toFixed(1));
    };

    const getTotalVotes = (question) => {
        return (question.options || []).reduce((sum, option) => sum + option.votes, 0);
    };

    const renderResults = (question) => {
        const totalVotes = getTotalVotes(question);

        return (
            <div className={styles.options_group}>
                <div className={styles.results_container}>
                    {(question.options || []).map((option) => {
                        const percent = getPercentage(option.votes, totalVotes);

                        return (
                            <div className={styles.result_row} key={option._id}>
                                <div className={styles.result_header}>
                                    <span className={styles.result_label}>{option.text}</span>
                                    <span className={styles.result_meta}>{percent}% ({option.votes})</span>
                                </div>

                                <div className={styles.result_bar_track}>
                                    <div
                                        className={styles.result_bar_fill}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const featuredQuestion = myQuestions[0];
    const remainingQuestions = myQuestions.slice(1);

    return (
        <div className={styles.voting_outer_div}>
            {isFetching && (
                <div className={styles.status_card}>
                    <div className={styles.page_spinner} aria-hidden="true"></div>
                    <p>Loading your questions...</p>
                </div>
            )}

            {!isFetching && fetchError && (
                <div className={`${styles.status_card} ${styles.status_card_error}`}>
                    <p>{fetchError}</p>
                </div>
            )}

            {!isFetching && !fetchError && featuredQuestion && (
                <div className={styles.voting_question_outer_div}>
                    <div className={styles.card_header}>
                        <span className={styles.card_badge}>Your Featured Poll</span>
                        <h2>{featuredQuestion.question}</h2>
                        <p>Posted by: {featuredQuestion.user?.username || "You"}</p>
                        <p>Total votes: {getTotalVotes(featuredQuestion)}</p>
                    </div>

                    {renderResults(featuredQuestion)}
                </div>
            )}

            {!isFetching && !fetchError && remainingQuestions.map((question) => (
                <div className={styles.question_card} key={question._id}>
                    <div className={styles.card_header}>
                        <span className={styles.card_badge_secondary}>Your Question</span>
                        <h3>{question.question}</h3>
                        <p>Posted by: {question.user?.username || "You"}</p>
                        <p>Total votes: {getTotalVotes(question)}</p>
                    </div>

                    {renderResults(question)}
                </div>
            ))}

            {!isFetching && !fetchError && myQuestions.length === 0 && (
                <div className={styles.status_card}>
                    <p>You have not posted any questions yet.</p>
                </div>
            )}
        </div>
    );
}

export default My_Question;
