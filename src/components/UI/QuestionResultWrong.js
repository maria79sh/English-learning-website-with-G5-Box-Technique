import classes from "../style/QuestionResultWrong.module.css";
import React from "react";


function QuestionResultWrong(props) {
    return (
        <div className={classes.card}>{props.children}
        </div>
    );
}

export default QuestionResultWrong;
