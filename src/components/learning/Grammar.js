import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import Layout from "../layout/Layout";
import StudyCard from "../UI/StudyCard";
import classes from "../style/Vocab.module.css";
import QuestionBox from "../UI/QuestionBox";
import {logout} from "../../apiServer/authRevoke";
import QuestionResult from "../UI/QuestionResult";
import {apiRequest} from "../../apiServer/api";
import {
    fetchNextGrammar,
    fetchNextGrammarAdvanced,
    postGrammarAnswer,
    postGrammarAnswerAdvanced
} from "../../apiServer/grammarApi";
import QuestionResultWrong from "../UI/QuestionResultWrong";


const Grammar = () => {
    const [grammar, setGrammar] = useState(null);
    const [result, setResult] = useState(null);
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [grammarId, setGrammarId] = useState(null);
    const [gid, setGid] = useState(null);
    const [disableOptions, setDisableOptions] = useState(false);
    const [level, setLevel] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setGid(data.grammar_path_id);
                setGrammarId(data.grammar_path_id);
                setLevel(data.level);
                console.log("Video ID:", data.grammar_path_id);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (grammarId !== null) {
            getNextGrammar(grammarId);
        }
    }, [grammarId]);

    const getNextGrammar = async (grammarId) => {
        const oqt = 'next';
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found');
            return;
        }

        console.log('Fetching next grammar with grammar Id:', grammarId, 'and oqt:', oqt);
        try {
            const data = level > 4 ?
                await fetchNextGrammarAdvanced(token, Number(grammarId), oqt) :
                await fetchNextGrammar(token, Number(grammarId), oqt);

            console.log('Fetched data:', data);
            setGrammar(data);
            setQuestion(data.question);
            setResult(null); // Clear previous result
            setDisableOptions(false);
        } catch (err) {
            console.error('Error fetching next grammar:', err);
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
            const data = level > 4 ?
                await postGrammarAnswerAdvanced(token, grammarId, answer) :
                await postGrammarAnswer(token, grammarId, answer);

            console.log('Answer response:', data);
            setResult(data);
            setDisableOptions(true);
        } catch (err) {
            console.error('Error posting answer:', err);
            setError(err.message);
        }
    };

    const handleNextVocab = () => {
        setGrammarId((prevGrammarId) => prevGrammarId + 1);
        setGid(grammarId);
    };
    const handlePreviousQuestion = () => {
        if (gid+1  > 0) {
            setGrammarId((prevGrammarId) => prevGrammarId - 1);
            setGid(grammarId);
        }
    };
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!grammar) {
        return <div>Loading...</div>;
    }


    return (
        <Fragment>
            <Layout></Layout>
            <StudyCard>
                <div>
                    <h2>Question <span>{JSON.stringify(gid + 1)}:</span></h2>

                </div>
                <QuestionBox>{JSON.stringify(question)}</QuestionBox>

                <div className={classes.options}>
                    {grammar.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)}
                                disabled={disableOptions} className={classes.ansbutton}
                        >{option}</button>
                    ))}
                </div>

                <div className={classes.actions}>
                    {result && (
                        <div className={classes.result}>
                            {result.check ? <QuestionResult>That's Correct!! Good Job :)) </QuestionResult>  : <QuestionResultWrong>Your Answer Is Wrong! </QuestionResultWrong> }
                        </div>
                    )}
                    <button onClick={handleNextVocab} className={classes.button}>Next One!</button>
                    <button onClick={handlePreviousQuestion} className={classes.buttonPrev} disabled={gid + 1 === 0}>Previous</button>

                </div>
            </StudyCard>
        </Fragment>

    );
};


export default Grammar;


