import "../style/PorgressLevel.css"
import "bootstrap/dist/css/bootstrap.min.css"
import Cup from "./Cup";
import {apiRequest} from "../../apiServer/api";
import {useEffect, useState} from "react";
import CalculateVocab from "./VocabLevel";
import '../style/Level.css';
import {Link} from "react-router-dom";


function Level() {
    const [finalWritingScore, setFinalWritingScore] = useState(null);
    const [finalVocabScore, setFinalVocabScore] = useState(null);
    const [finalListeningScore, setFinalListeningScore] = useState(null);
    const [finalGrammarScore, setFinalGrammarScore] = useState(null);


    const calculateScore = (correctAnswers, wrongAnswers, totalScore) => {
        return totalScore !== 0 ? ((correctAnswers * 3 - wrongAnswers) / totalScore) * 100 : 0;
    };
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                const totalScore = Number(data.score);

                const finalVocabScore = calculateScore(data.vocab.correct_answers ?? 0, data.vocab.wrong_answers ?? 0, totalScore);
                setFinalVocabScore(finalVocabScore.toFixed(0));

                const finalWritingScore = calculateScore(data.writing.correct_answers ?? 0, data.writing.wrong_answers ?? 0, totalScore);
                setFinalWritingScore(finalWritingScore.toFixed(0));

                const finalListeningScore = calculateScore(data.listening.correct_answers ?? 0, data.listening.wrong_answers ?? 0, totalScore);
                setFinalListeningScore(finalListeningScore.toFixed(0));

                const finalGrammarScore = calculateScore(data.grammar.correct_answers ?? 0, data.grammar.wrong_answers ?? 0, totalScore);
                setFinalGrammarScore(finalGrammarScore.toFixed(0));

            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserData();
    }, []);


    return (
        <div className="levelDiv">
            <Cup></Cup>
            <div className="progressSection">

                <div className="card text-white ">
                    <Link className="card-header"  to="/vocab"> مهارت لغت </Link>
                    {/*<div className="card-header">مهارت لغت</div>*/}
                    <div className="card-body">
                        <h5 className="card-title">{finalVocabScore || 0}%</h5>
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${finalVocabScore}%` }} aria-valuenow={finalVocabScore} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div className="card text-white ">
                    <Link className="card-header"  to="/Writing"> مهارت نوشتاری </Link>
                    {/*<div className="card-header">مهارت نوشتاری</div>*/}
                    <div className="card-body">
                        <h5 className="card-title">{finalWritingScore || 0}%</h5>
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${finalWritingScore}%` }} aria-valuenow={finalWritingScore} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div className="card text-white ">
                    <Link className="card-header"  to="/listening"> مهارت شنیداری </Link>
                    {/*<a className="card-header" href="/listening">مهارت شنیداری</a>*/}
                    <div className="card-body">
                        <h5 className="card-title">{finalListeningScore || 0}%</h5>
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${finalListeningScore}%` }} aria-valuenow={finalListeningScore} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div className="card text-white ">
                    <Link className="card-header"  to="/grammar"> مهارت گرامر </Link>
                    {/*<a className="card-header" href="/grammar">مهارت گرامر</a>*/}
                    <div className="card-body">
                        <h5 className="card-title">{finalGrammarScore || 0}%</h5>
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${finalGrammarScore}%` }} aria-valuenow={finalGrammarScore} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Level;




