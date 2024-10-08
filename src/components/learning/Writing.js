import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import Layout from "../layout/Layout";
import classes from "../style/Vocab.module.css";
import StudyCard from "../UI/StudyCard";
import QuestionBox from "../UI/QuestionBox";
import {fetchNextWriting, postWritingAnswer} from "../../apiServer/writingApi";
import QuestionResult from "../UI/QuestionResult";
import {apiRequest} from "../../apiServer/api";
import QuestionResultWrong from "../UI/QuestionResultWrong";


    const Writing = () => {
        const [writing, setWriting] = useState(null);
        const [result, setResult] = useState(null);
        const [question, setQuestion] = useState(null);
        const [error, setError] = useState(null);
        const [writingId, setWritingId] = useState(null);
        const [wid, setWid] = useState(null);
        const [disableOptions, setDisableOptions] = useState(false);

        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                    setWid(data.writing_path_id);
                    setWritingId(data.writing_path_id);
                    console.log(" ID:", data.writing_path_id);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };
            fetchUserData();
        }, []);

        useEffect(() => {
            if (writingId !== null) {
                getNextWriting(writingId);
            }
        }, [writingId]);

        const getNextWriting = async (writingId) => {
            const oqt = 'next';
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No token found');
                return;
            }

            console.log('Fetching next vocab with vocabId:', writingId, 'and oqt:', oqt);
            try {
                const data = await fetchNextWriting(token, Number(writingId), oqt);
                console.log('Fetched data:', data);
                setWriting(data);
                setQuestion(data.question);
                setResult(null);
                setDisableOptions(false);
            } catch (err) {
                console.error('Error fetching next vocab:', err);
                setError(err.message);
            }
        };

        const handleAnswer = async (answer) => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                return;
            }

            try {
                const data = await postWritingAnswer(token, writingId, answer);
                console.log('Answer response:', data);
                setResult(data);
                setDisableOptions(true); // Disable options if the answer is incorrect
            } catch (err) {
                console.error('Error posting answer:', err);
                setError(err.message);
            }
        };

        const handleNextWriting = () => {
            setWritingId((prevWritingId) => prevWritingId + 1);
            setWid(writingId);
        };
        const handlePreviousQuestion = () => {
            if (wid+1  > 0) {
                setWritingId((prevWritingId) => prevWritingId - 1);
                setWid(writingId);
            }
        };
        if (error) {
            return <div>Error: {error}</div>;
        }

        if (!writing) {
            return <div>Loading...</div>;
        }

        return (
        <Fragment>
            <Layout></Layout>
        <StudyCard>
            <div>
                <h2>Question   <span>{JSON.stringify(wid+1)}</span> </h2>

            </div>
            <QuestionBox>{JSON.stringify(question)}</QuestionBox>
            <div className={classes.options}>
                {writing.options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswer(option)}
                            className={classes.ansbutton}  disabled={disableOptions}
                    >{option}</button>
                ))}
            </div>

            <div className={classes.actions}>

                {result && (
                    <div className={classes.result}>
                        {result.check ? <QuestionResult>That's Correct!! Good Job :)) </QuestionResult>  : <QuestionResultWrong>Your Answer Is Wrong! </QuestionResultWrong> }
                    </div>
                )}
                <button className={classes.button}  onClick={handleNextWriting}>Next One!</button>
                <button onClick={handlePreviousQuestion} className={classes.buttonPrev} disabled={wid + 1 === 0}>Previous</button>

            </div>
        </StudyCard>
        </Fragment>
    );
}

export default Writing;
