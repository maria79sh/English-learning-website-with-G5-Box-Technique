import React from "react";
import classes from "../style/QuizModal.module.css";
import sad from "../../assets/icons/sad.svg"
import { useNavigate} from "react-router-dom";

const QuizFailModal = ({ isOpen, onClose }) => {
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
                <img src={sad} className={classes.modalImg}/>
                <h2 className={classes.msg} >Oops!</h2>
                <p className={classes.modalLine} >Some of your answers were wrong!<br />
                    Come back and try again.</p>
                <button className={classes.failModalBtn}  onClick={handleRedirect}>GO TO HOME PAGE</button>
            </div>
        </div>
    );
};

export default QuizFailModal;
