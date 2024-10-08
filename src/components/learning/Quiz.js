import { useEffect, useState, Fragment } from "react";
import { apiRequest } from "../../apiServer/api";
import Layout from "../layout/Layout";
import StudyCard from "../UI/StudyCard";
import QuestionBox from "../UI/QuestionBox";
import classes from "../style/Vocab.module.css";
import QuestionResult from "../UI/QuestionResult";
import Confetti from "react-confetti";
import QuizSuccessModal from "./QuizSuccessModal";
import QuizFailModal from "./QuizFailModal";
import { jsPDF } from "jspdf";


const Quiz = () => {
    const [user, setUser] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [userResponses, setUserResponses] = useState({});
    const [cupId, setCupId] = useState(null);
    const [result, setResult] = useState(null);
    const [allAnswered, setAllAnswered] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [showIncorrectModal, setShowIncorrectModal] = useState(false);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiRequest('http://127.0.0.1:8080/api/v1/current_user', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer your_token_here'
                    }
                });

                setUser(userData);
                setCupId(userData.cup_id);
                console.log(user)

                if (userData.cup_id) {
                    const quizData = await apiRequest(`http://127.0.0.1:8080/api/v1/get_quiz?cup_id=${userData.cup_id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer your_token_here'
                        }
                    });

                    setQuiz(quizData);
                    console.log(quiz)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (quiz) {
            const answeredQuestions = Object.keys(userResponses).length;
            setAllAnswered(answeredQuestions === quiz.quiz_items.length);
        }
    }, [userResponses, quiz]);

    if (!quiz || !quiz.quiz_items || quiz.quiz_items.length === 0) {
        return <p>No quiz items available.</p>;
    }

    const handleOptionChange = (questionIndex, selectedOption) => {
        setUserResponses({
            ...userResponses,
            [questionIndex]: selectedOption
        });
        console.log(userResponses);
    };

    const checkQuizAnswers = async () => {
        const data = {
            qid: cupId,
            response_items: Object.values(userResponses)
        };

        if (cupId) {
            const response = await apiRequest(`http://127.0.0.1:8080/api/v1/check_quiz`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer your_token_here',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log(data);
            console.log(response);
            setResult(response);
            if (response && response.check) {
                setShowModal(true);
            }else {
                setShowIncorrectModal(true);
            }

        }
    }

    if (!quiz) {
        return <div>Loading quiz...</div>;
    }

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`Quiz Number ${user.cup_id}`, 20, 20);


        let yPosition = 30;
        const pageHeight = doc.internal.pageSize.height;

        quiz.quiz_items.forEach((question, index) => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(16);
            doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
            yPosition += 10;

            question.options.forEach((option, optIndex) => {
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.setFontSize(14);
                doc.text(`    ${String.fromCharCode(65 + optIndex)}. ${option}`, 30, yPosition);
                yPosition += 10;
            });

            yPosition += 10;
        });

        doc.save(`quiz_${user.cup_id}.pdf`);
    };
    return (
        <Fragment>
            <Layout></Layout>
            <StudyCard>
                <div className={classes.questionHdr}>
                    <h2> Quiz Number {user.cup_id} :
                    </h2>
                    <button className={classes.pdfBtn}  onClick={downloadPDF} role="button">Get PDF</button>

                </div>

                {quiz.quiz_items.map((item, index) => (
                    <div key={index} className="question-container">
                        <QuestionBox>Question {index + 1}: {item.question}</QuestionBox>
                        <div className={classes.options}>
                            {item.options.map((option, optIndex) => (
                                <button key={optIndex}
                                        className={classes.ansbutton}
                                        onClick={() => handleOptionChange(index, option)}
                                        disabled={userResponses.hasOwnProperty(index)} // Disable button if the question is answered
                                >{option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <div className={classes.actions}>
                    {result && (
                        <div className={classes.result}>
                            {result.check ? <QuestionResult>CONGRATULATIONS! Check Home for your new Cup! </QuestionResult>
                                :
                                <QuestionResult>Some of your answers are Wrong! Try Again</QuestionResult>}
                        </div>
                    )}
                    <button
                        className={classes.button}
                        onClick={checkQuizAnswers}
                        disabled={!allAnswered}
                    >
                        Submit!
                    </button>

                </div>
            </StudyCard>
            <QuizSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <QuizFailModal isOpen={showIncorrectModal} />
            <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} run={showModal} />

        </Fragment>
    );
};

export default Quiz;
