import { useContext, useEffect, useState } from "react";
import styles from "../style/vote_ui.module.css";
import { GetQuestion } from "../api/getQuestionApi";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Vote_UI() {
    const [questionData, setQuestionData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [submittingVote, setSubmittingVote] = useState({});
    const [voteError, setVoteError] = useState({});
    const [activeFilter, setActiveFilter] = useState("recent");

    const islogined = useContext(UserContext).user.islogined;

    useEffect(() => {
        const fetchQuestions = async () => {
            setFetchError("");

            try {
                const data = await GetQuestion();
                setQuestionData(Array.isArray(data) ? data : []);

                const totalQuestions = Array.isArray(data) ? data.length : 0;
                console.log(`Fetched ${totalQuestions} questions from the server.`);

                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    setUserId(user.id);
                    console.log(data);
                }
            } catch (error) {
                setFetchError(error?.response?.data?.message || "Unable to load questions right now.");
                setQuestionData([]);
            } finally {
                setIsFetching(false);
                setHasFetchedOnce(true);
            }
        };

        fetchQuestions();

        const intervalId = setInterval(fetchQuestions, 30000); // Refresh questions every 30 seconds

        return () => clearInterval(intervalId);
    }, []);

    const hasVoted = (question) => {
        return question.hasvoted?.some((vote) => String(vote.userId) === String(userId));
    };

    const getUserVote = (question) => {
        return question.hasvoted?.find((vote) => String(vote.userId) === String(userId));
    };

    const getPercentage = (optionVotes, totalVotes) => {
        if (totalVotes === 0) return 0;
        return Number(((optionVotes / totalVotes) * 100).toFixed(1));
    };

    const getTotalVotes = (question) => {
        return (question.options || []).reduce((sum, option) => sum + option.votes, 0);
    };

    const handleVote = async (questionId, optionId) => {
        if (!islogined) {
            alert("Please login to vote.");
            return;
        }
        if (submittingVote[questionId]) return;

        setVoteError((prev) => ({ ...prev, [questionId]: "" }));
        setSubmittingVote((prev) => ({ ...prev, [questionId]: optionId }));

        try {
            await axios.post(
                "https://bobtail-t-shirt-siesta.ngrok-free.dev/api/questions/votequestion",
                { questionId, optionId },
                { withCredentials: true }
            );

            setQuestionData((prev) =>
                prev.map((question) => {
                    if (question.id !== questionId) {
                        return question;
                    }

                    return {
                        ...question,
                        options: question.options.map((option) =>
                            option.id === optionId
                                ? { ...option, votes: option.votes + 1 }
                                : option
                        ),
                        hasvoted: [...(question.hasvoted || []), { userId, optionId }]
                    };
                })
            );
        } catch (error) {
            setVoteError((prev) => ({
                ...prev,
                [questionId]: error?.response?.data?.message || "Vote failed. Please try again."
            }));
        } finally {
            setSubmittingVote((prev) => ({ ...prev, [questionId]: null }));
        }
    };

    const renderOptions = (question) => {
        const totalVotes = getTotalVotes(question);
        const voted = hasVoted(question);
        const userVote = getUserVote(question);
        const activeVoteOption = submittingVote[question.id];

        return (
            <div className={styles.options_group}>
                {!voted ? (
                    <div className={styles.button_grid}>
                        {question.options.map((option) => {
                            const isLoading = activeVoteOption === option.id;
                            const isQuestionLoading = Boolean(activeVoteOption);

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`${styles.option_button} ${isLoading ? styles.option_button_loading : ""}`}
                                    onClick={() => handleVote(question.id, option.id)}
                                    disabled={isQuestionLoading}
                                    aria-busy={isLoading}
                                >
                                    <span className={styles.option_button_text}>{option.text}</span>
                                    {isLoading && <span className={styles.button_spinner} aria-hidden="true"></span>}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.results_container}>
                        {question.options.map((option) => {
                            const percent = getPercentage(option.votes, totalVotes);
                            const isSelected = userVote?.optionId === option.id;

                            return (
                                <div className={styles.result_row} key={option.id}>
                                    <div className={styles.result_header}>
                                        <span className={styles.result_label}>
                                            {option.text}
                                            {isSelected && <span className={styles.selected_badge}>Your vote</span>}
                                        </span>
                                        <span className={styles.result_meta}>{percent}% ({option.votes})</span>
                                    </div>

                                    <div className={styles.result_bar_track}>
                                        <div
                                            className={`${styles.result_bar_fill} ${isSelected ? styles.result_bar_fill_selected : ""}`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {voteError[question.id] && (
                    <p className={styles.error_message}>{voteError[question.id]}</p>
                )}
            </div>
        );
    };

    const filteredQuestions = activeFilter === "controversial"
        ? questionData.filter((question) => getTotalVotes(question) >= 4)
        : questionData;

    const featuredQuestion = filteredQuestions[0];
    const remainingQuestions = filteredQuestions.slice(1);

    return (
        <div className={styles.voting_outer_div}>
            {hasFetchedOnce && !isFetching && !fetchError && (
                <div className={styles.filter_panel}>
                    <p className={styles.filter_title}>Browse Questions</p>
                    <div className={styles.filter_options}>
                        <label className={`${styles.filter_option} ${activeFilter === "recent" ? styles.filter_option_active : ""}`}>
                            <input
                                type="radio"
                                name="questionFilter"
                                value="recent"
                                checked={activeFilter === "recent"}
                                onChange={() => setActiveFilter("recent")}
                            />
                            <span>Recent</span>
                        </label>

                        <label className={`${styles.filter_option} ${activeFilter === "controversial" ? styles.filter_option_active : ""}`}>
                            <input
                                type="radio"
                                name="questionFilter"
                                value="controversial"
                                checked={activeFilter === "controversial"}
                                onChange={() => setActiveFilter("controversial")}
                            />
                            <span>Controversial</span>
                        </label>
                    </div>
                </div>
            )}

            {hasFetchedOnce && !isFetching && fetchError && (
                <div className={`${styles.status_card} ${styles.status_card_error}`}>
                    <p>{fetchError}</p>
                </div>
            )}

            {hasFetchedOnce && !isFetching && !fetchError && featuredQuestion && (
                <div className={styles.voting_question_outer_div}>
                    <div className={styles.card_header}>
                        <span className={styles.card_badge}>Featured Poll</span>
                        <h2>{featuredQuestion.question}</h2>
                        <p>Posted by: {featuredQuestion.user?.username || "Anonymous"}</p>
                    </div>

                    {renderOptions(featuredQuestion)}
                </div>
            )}

            {hasFetchedOnce && !isFetching && !fetchError && remainingQuestions.map((question) => (
                <div className={styles.question_card} key={question.id}>
                    <div className={styles.card_header}>
                        <span className={styles.card_badge_secondary}>Live Vote</span>
                        <h3>{question.question}</h3>
                        <p>Posted by: {question.user?.username || "Anonymous"}</p>
                    </div>

                    {renderOptions(question)}
                </div>
            ))}

            {hasFetchedOnce && !isFetching && !fetchError && activeFilter === "recent" && questionData.length === 0 && (
                <div className={styles.status_card}>
                    <p>No questions available yet.</p>
                </div>
            )}

            {hasFetchedOnce && !isFetching && !fetchError && activeFilter === "controversial" && filteredQuestions.length === 0 && (
                <div className={styles.status_card}>
                    <p>No data for this field.</p>
                </div>
            )}
        </div>
    );
}

export default Vote_UI;
