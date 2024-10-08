import React from "react";
import classes from "../style/QuizModal.module.css";
import congrats from "../../assets/icons/congrats.svg"
import Confetti from "react-confetti";
import {useNavigate} from "react-router-dom";

const QuizSuccessModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }
    const handleRedirect = () => {
        navigate('/home');
    };
    return (
        <div className={classes.modalBackdrop}>
            <div className={classes.modal}>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    run={isOpen}
                />

                <img src={congrats} className={classes.modalImg}/>
                <h2 className={classes.msg} >Congratulations!</h2>
                <p className={classes.modalLine} >Check Home Page
              for your new cup!</p>
                <button className={classes.modalBtn}  onClick={handleRedirect}>GO TO HOME PAGE</button>
            </div>
        </div>
    );
};

export default QuizSuccessModal;
