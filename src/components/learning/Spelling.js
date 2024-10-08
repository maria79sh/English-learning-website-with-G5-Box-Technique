import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import Layout from "../layout/Layout";
import classes from "../style/Vocab.module.css";
import StudyCard from "../UI/StudyCard";
import QuestionBox from "../UI/QuestionBox";
import {fetchNextSpelling, postSpellingAnswer} from "../../apiServer/spellingApi";
import QuestionResult from "../UI/QuestionResult";
import {apiRequest} from "../../apiServer/api";
import QuestionResultWrong from "../UI/QuestionResultWrong";
import check from "../../assets/icons/check.svg"

const Spelling = () => {

    const [spelling, setSpelling] = useState(null);
    const [result, setResult] = useState(null);
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [spellingId, setSpellingId] = useState(null);
    const [sid, setSid] = useState(null);
    const [spellingAns, setSpellingAns] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setSid(data.spelling_path_id);
                setSpellingId(data.spelling_path_id);
                console.log(" ID:", data.spelling_path_id);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (spellingId !== null) {
            getNextSpelling(spellingId);
        }
    }, [spellingId]);


    const handleInputChange = (e) => {
        setSpellingAns(e.target.value);
    };

    const getNextSpelling = async (spellingId) => {
        const oqt = 'next';
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found');
            return;
        }

        console.log('Fetching next spelling with spellingId:', spellingId, 'and oqt:', oqt);
        try {
            const data = await fetchNextSpelling(token, Number(spellingId), oqt);
            console.log('Fetched data:', data);
            setSpelling(data);
            setQuestion(data.question);
            setResult(null); // Clear previous result
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
            const data = await postSpellingAnswer(token, spellingId, spellingAns);
            console.log('Answer response:', data);
            setResult(data);
            console.log(result);
        } catch (err) {
            console.error('Error posting answer:', err);
            setError(err.message);
        }
    };

    const handleNextWriting = () => {

        setSpellingId((prevSpellingId) => prevSpellingId + 1);
        setSid(spellingId);
    };
    const handlePreviousQuestion = () => {
        if (sid+1  > 0) {
            setSpellingId((prevSpellingId) => prevSpellingId - 1);
            setSid(spellingId);
        }
    };
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!spelling) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <Layout></Layout>
            <StudyCard>
                <h2 className={classes.spellingQst}>Write out the word below correctly</h2>
                <div className={classes.spellingSec}>
                    <QuestionBox>{JSON.stringify(question)}</QuestionBox>

                <div className={classes.spellingAns}>
                    <input type="text" value={spellingAns}
                           onChange={handleInputChange}
                           placeholder="Enter your answer"/>
                    <img src={check}                 onClick={handleAnswer}
                         className={classes.spellingCheck}/>

                </div>
                </div>
                <div className={classes.spelling_actions}>

                    {result && (
                        <div className={classes.result}>
                            {result.check ? <QuestionResult>That's Correct!! Good Job :)) </QuestionResult>  : <QuestionResultWrong>Your Answer Is Wrong! </QuestionResultWrong> }
                        </div>
                    )}
                    <button className={classes.button}  onClick={handleNextWriting}>Next One!</button>
                    <button onClick={handlePreviousQuestion} className={classes.buttonPrev} disabled={sid + 1 === 0}>Previous</button>

                </div>
            </StudyCard>
        </Fragment>
    );
}

export default Spelling;
