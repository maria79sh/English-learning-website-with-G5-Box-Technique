import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import Layout from "../layout/Layout";
import StudyCard from "../UI/StudyCard";
import closedBox from "../../assets/icons/boxClosed.svg";
import openedBox from "../../assets/icons/boxOpened.svg";
import Light from "../../assets/icons/light.svg";
import plus from "../../assets/icons/plus.svg";
import G5Modal from "./G5Modal";
import '../style/FlashCard.css';
import Timer from "./Timer";
import QuestionResult from "../UI/QuestionResult";
import classes from "../style/Vocab.module.css";
import QuestionResultWrong from "../UI/QuestionResultWrong";


const G5 = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [scheduleKey, setScheduleKey] = useState('');
    const [timerSecondsDay, setTimerSecondsDay] = useState(null);
    const [timerSecondsDays, setTimerSecondsDays] = useState(null);
    const [timerSecondsWeek, setTimerSecondsWeek] = useState(null);
    const [result, setResult] = useState(null);

    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');

    const [isEveryOtherDayDisabled, setEveryOtherDayDisabled] = useState(false);
    const [isEveryWeekDisabled, setEveryWeekDisabled] = useState(false);

    const [timerActive, setTimerActive] = useState(false);

    // Countdown timer logic
    useEffect(() => {
        let interval = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTimerSecondsDay((prevSeconds) => {
                    if (prevSeconds > 0) {
                        return prevSeconds - 1;
                    } else {
                        clearInterval(interval);
                        setTimerActive(false);
                        return 0;
                    }
                });
                setTimerSecondsDays((prevSeconds) => {
                    if (prevSeconds > 0) {
                        return prevSeconds - 1;
                    } else {
                        clearInterval(interval);
                        setTimerActive(false);
                        setEveryOtherDayDisabled(false);
                        return 0;
                    }
                });
                setTimerSecondsWeek((prevSeconds) => {
                    if (prevSeconds > 0) {
                        return prevSeconds - 1;
                    } else {
                        clearInterval(interval);
                        setTimerActive(false);
                        setEveryWeekDisabled(false);
                        return 0;
                    }
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive]);



    const fetchWords = async (scheduleKey) =>
    {
        // Set timer for days (in seconds)

        if(scheduleKey === 1) {
            const twoDaysInSeconds = 2 * 24 * 60 * 60;
            setTimerSecondsDays(twoDaysInSeconds);
            setTimerActive(true);
            setEveryOtherDayDisabled(true);


            const sevenDaysInSeconds = 7 * 24 * 60 * 60;
            setTimerSecondsWeek(sevenDaysInSeconds);
            setTimerActive(true);
            setEveryWeekDisabled(true);


            const oneDayInSeconds =  24 * 60 * 60;
            setTimerSecondsDay(oneDayInSeconds);
            setTimerActive(true);
        }

        if(scheduleKey === 2) {
            const twoDaysInSeconds = 2 * 24 * 60 * 60;
            setTimerSecondsDays(twoDaysInSeconds);
            setTimerActive(true);
            // setEveryOtherDayDisabled(true);


            const sevenDaysInSeconds = 5 * 24 * 60 * 60;
            setTimerSecondsWeek(sevenDaysInSeconds);
            setTimerActive(true);
            setEveryWeekDisabled(true);


            const oneDayInSeconds =  24 * 60 * 60;
            setTimerSecondsDay(oneDayInSeconds);
            setTimerActive(true);
        }


            setScheduleKey(scheduleKey);
            const url = `http://127.0.0.1:8080/api/v1/get_box_words?schedule_key=${scheduleKey}`;
            console.log('Fetching words from URL:', url);
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching words from URL:', token);

                if (!token) {
                    throw new Error('No token found in local storage');
                }
                const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setWords(data);
            console.log('words:', words[0]);
            setCurrentWordIndex(0);
             setFeedback('');





        } catch (error) {
            console.error('Error fetching words:', error);
        }
    };

    const handleUserAnswer = (e) => {
        setUserAnswer(e.target.value);
    };

    const handleFlip= () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setFeedback('');
        setUserAnswer('');
        setIsFlipped(false); // Reset the flip state for the new word
        console.log("answer was true")
    };


    const handleCheckAnswer = async () => {
        try {
            const currentWord = words[currentWordIndex];
            console.log(currentWord);
            // console.log("kety is ", scheduleKey);
            const token = localStorage.getItem('token');

            const response = await fetch('http://127.0.0.1:8080/api/v1/move_box_word', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    qid: currentWord,
                    user_answer: userAnswer,
                    box_key: scheduleKey
                })
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Error:', response.status, response.statusText, errorDetails);
                throw new Error(`Error: ${response.statusText} - ${errorDetails}`);
            }

            const data = await response.json();
            console.log('API Response:', data);


            if (data.message === 'word check true') {
                console.log("answer was truee")
                handleNext();
            } else {
                setIsFlipped(true);
                setCorrectAnswer(data.correct_answer);
                setFeedback('Incorrect!');
            }
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    };

    const openModal = (e) => {
        e.preventDefault();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    useEffect(() => {
        if (words.length > 0) {
            console.log('Current word:', words[currentWordIndex]);
        }
    }, [currentWordIndex, words]);


    // Function to handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'word') {
            setWord(value);
        } else if (name === 'meaning') {
            setMeaning(value);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://127.0.0.1:8080/api/v1/add_flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: word,
                    answer: meaning
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('API flash card Response:', data);
            // if (data.message === 'words submitted successfully') {
            //     setResult(true);
            //     console.log('Setting result to true');
            //
            // } else {
            //     setResult(false);
            // }
            // Optionally, reset input fields or show a success message
        } catch (error) {
            console.error('Error:', error);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://127.0.0.1:8080/api/v1/set_box_word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    schedule_key: 1,
                    word: word
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('API add flash card Response:', data);
            if (data.message === 'words submitted successfully') {
                console.log('Setting result to trueeeeeeee');
                setResult(true);
            } else {
                setResult(false);
            }

        } catch (error) {
            console.error('Error:', error);
            // setResult(false);
        }
    };

    return (
        <Fragment>
            <Layout></Layout>
            <StudyCard>
                <div>
                    <a href="#" onClick={openModal}>
                        <img className="light" src={Light} alt="first Cup"/>
                    </a>
                    <G5Modal isOpen={isModalOpen} onClose={closeModal}/>
                </div>

                <div className="g5Header">
                    {/*<FlashCard></FlashCard>*/}
                    <div className="flashcard-wrapper">
                        {words.length > 0 && (
                            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                            <div className="flashcard-inner">
                                <div className="flashcard-front">
                                    <h2>{words[currentWordIndex] || 'Loading...'}</h2>
                                    <input type="text" value={userAnswer} onChange={handleUserAnswer} ></input>
                                    <button className="flip-button" onClick={handleCheckAnswer}>Check!</button>
                                </div>
                                <div className="flashcard-back">
                                    <h2 className="word">{words[currentWordIndex] || 'Loading...'}</h2>
                                    <h2 className="correctAnswer">{correctAnswer}</h2>
                                    <p className="feedback">{feedback}</p>
                                    <button className="addWordsBtn" onClick={handleNext}>Next Word</button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className="firstRow">
                    <div>
                        <img className="boxImg" src={openedBox} alt="first Cup"/>
                        <button  className="boxBtn" role="button" onClick={() => fetchWords(1)}> Every Day</button>

                        {timerActive && (
                            <div>
                                <Timer timerSeconds={timerSecondsDay} />
                            </div>
                        )}
                    </div>
                    <div>
                        <img className="boxImg" src={isEveryOtherDayDisabled ? closedBox : openedBox} alt="first Cup"/>
                        <button className="boxBtn" role="button" onClick={() => fetchWords(2)} disabled={isEveryOtherDayDisabled}> Every Other Day
                        </button>
                        {timerActive && (
                            <div>
                                <Timer timerSeconds={timerSecondsDays} />
                            </div>
                        )}
                    </div>
                    <div>
                        <img className="boxImg" src={isEveryWeekDisabled ? closedBox : openedBox}  alt="first Cup"/>
                        <button className="boxBtn" role="button" onClick={() => fetchWords(3)} disabled={isEveryWeekDisabled} > Every Week</button>
                        {timerActive && (
                            <div>
                                <Timer timerSeconds={timerSecondsWeek} />
                            </div>
                        )}
                    </div>

                </div>
                <div className="secondRow">
                    <div>
                        <img className="addImg" src={plus} alt="add"/>

                    </div>
                    <div className="addWordsBody">
                        <p className="addWords" > Add Your Daily Words Here </p>
                        <input placeholder="Word"
                               className="addWordsInput"
                               name="word"
                               value={word}
                               onChange={handleInputChange}
                               type="text"/>
                        <input   placeholder="Meaning"
                                 className="addAnsInput"
                                 name="meaning"
                                 value={meaning}
                                 onChange={handleInputChange}
                                 type="text"/>
                    </div>
                    <button onClick={handleSubmit} className="addWordsBtn" role="button">Add Word</button>
                    {result !== null && (
                        <div className="result">
                            {result ? (
                                <QuestionResult>Word added!</QuestionResult>
                            ) : (
                                <QuestionResultWrong>Word was not added!</QuestionResultWrong>
                            )}
                        </div>
                    )}

                </div>


            </StudyCard>
        </Fragment>

    );
};


export default G5;


