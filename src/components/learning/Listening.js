import React, {useEffect, useState} from "react";
import Layout from "../layout/Layout";
import StudyCard from "../UI/StudyCard";
import classes from "../style/Listening.module.css";
import SpeakerIcon from "../UI/speaker";
import {fetchNextListening, postListeningAnswer} from "../../apiServer/listeningApi";
import QuestionResult from "../UI/QuestionResult";
import {apiRequest} from "../../apiServer/api";
import ReactAudioPlayer from 'react-audio-player';
import QuestionResultWrong from "../UI/QuestionResultWrong";

const Listening = () => {

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [listeningId, setListeningId] = useState(null);
    const [disableOptions, setDisableOptions] = useState(false);
    const [listening, setListening] = useState(null);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setListeningId(data.listening_path_id);
                console.log("Listening ID:", data.listening_path_id);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (listeningId !== null) {
            getNextListening(listeningId);
        }
    }, [listeningId]);

    const getNextListening = async (id) => {
        const oqt = 'next';
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found');
            return;
        }

        console.log('Fetching next audio with Id:', id, 'and oqt:', oqt);
        try {
            const data = await fetchNextListening(token, Number(id), oqt);
            console.log('Fetched data:', data);
            setAudio(data.audio_path);
            setListening(data);
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
            const data = await postListeningAnswer(token, listeningId, answer);
            console.log('Answer response:', data);
            setResult(data);
            setDisableOptions(true);
        } catch (err) {
            console.error('Error posting answer:', err);
            setError(err.message);
        }
    };

    const handleNextListening = () => {
        setListeningId((prevListeningId) => prevListeningId + 1);
    };

    const handlePreviousQuestion = () => {
        if (listeningId > 0) {
            setListeningId((prevListeningId) => prevListeningId - 1);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!listening) {
        return <div>Loading...</div>;
    }

    return (
        <main>
            <Layout />
            <StudyCard>
                <div>
                    <h2>Question <span>{listeningId + 1}:</span></h2>
                </div>
                <div className={classes.speaker}>
                    <SpeakerIcon />
                    <h3>Listen to this audio and choose the correct option</h3>
                    {audio && (

                        <ReactAudioPlayer
                            src={`http://127.0.0.1:8080/${audio}`}
                            controls
                            className={classes.custom_audio_player}
                        />
                    )}
                </div>
                <div className={classes.options}>
                    {listening.options && listening.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)}
                                disabled={disableOptions} className={classes.ansbutton}
                        >{option}</button>
                    ))}
                </div>
                <div className={classes.actions}>
                    {result && (
                        <div className={classes.result}>
                            {result.check ? <QuestionResult>That's Correct! Good Job</QuestionResult> : <QuestionResultWrong>Your Answer Is Wrong! </QuestionResultWrong>}
                        </div>
                    )}
                    <button onClick={handleNextListening} className={classes.button}>Next One!</button>
                    <button onClick={handlePreviousQuestion} className={classes.buttonPrev} disabled={listeningId === 0}>Previous</button>
                </div>
            </StudyCard>
        </main>
    );
};

export default Listening;
