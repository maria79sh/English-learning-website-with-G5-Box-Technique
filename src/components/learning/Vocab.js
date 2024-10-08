import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import Layout from "../layout/Layout";
import StudyCard from "../UI/StudyCard";
import classes from "../style/Vocab.module.css";
import QuestionBox from "../UI/QuestionBox";
import {
    fetchNextVocab,
    fetchNextVocabAdvanced,
    postVocabAnswer,
    postVocabAnswerAdvanced
} from '../../apiServer/vocabApi';
import QuestionResult from "../UI/QuestionResult";
import {apiRequest} from "../../apiServer/api";
import QuestionResultWrong from "../UI/QuestionResultWrong";

const Vocab = () => {

    const [vocab, setVocab] = useState(null);
    const [result, setResult] = useState(null);
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [vocabId, setVocabId] = useState(null);
    const [vid, setVid] = useState(null);
    const [level, setLevel] = useState(null);
    const [disableOptions, setDisableOptions] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setVid(data.vocab_path_id);
                setVocabId(data.vocab_path_id);
                setLevel(data.level);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (vocabId !== null) {
            getNextVocab(vocabId);
        }
    }, [vocabId]);

    const getNextVocab = async (vocabId) => {
        const oqt = 'next';
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found');
            return;
        }

        console.log('Fetching next vocab with vocabId:', vocabId, 'and oqt:', oqt);

        try {
            const data = level > 2 ?
                await fetchNextVocabAdvanced(token, Number(vocabId), oqt) :
                await fetchNextVocab(token, Number(vocabId), oqt);

            console.log('Fetched data:', data);
            setVocab(data);
            setQuestion(data.question);
            setResult(null); // Clear previous result
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
            const data = level > 2 ?
                await postVocabAnswerAdvanced(token, vocabId, answer) :
                await postVocabAnswer(token, vocabId, answer);

            console.log('Answer response:', data);
            setResult(data);
            setDisableOptions(true); // Disable options if the answer is incorrect
        } catch (err) {
            console.error('Error posting answer:', err);
            setError(err.message);
        }

    };

    const handleNextVocab = () => {
        setVocabId((prevVocabId) => prevVocabId + 1);
        setVid(vocabId);
    };
    const handlePreviousQuestion = () => {
        if (vid+1  > 0) {
            setVocabId((prevVocabId) => prevVocabId - 1);
            setVid(vocabId);
        }
    };
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!vocab) {
        return <div>Loading...</div>;
    }


    return (
        <Fragment>
            <Layout></Layout>
            <StudyCard>
                <div>
                    <h2>Question <span>{JSON.stringify(vid + 1)}:</span></h2>

                </div>
                <QuestionBox>{JSON.stringify(question)}</QuestionBox>

                <div className={classes.options}>
                    {vocab.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)}
                                disabled={disableOptions} className={classes.ansbutton}
                        >{option}</button>
                    ))}
                </div>

                <div className={classes.actions}>
                    {result && (
                        <div className={classes.result}>
                            {result.check ? <QuestionResult>That's Correct!! Good Job :)) </QuestionResult>  :  <QuestionResultWrong>Your Answer Is Wrong! </QuestionResultWrong> }
                        </div>
                    )}
                    <button onClick={handleNextVocab} className={classes.button}>Next One!</button>
                    <button onClick={handlePreviousQuestion} className={classes.buttonPrev} disabled={vid + 1 === 0}>Previous</button>

                </div>
            </StudyCard>
        </Fragment>

    );
};


export default Vocab;


