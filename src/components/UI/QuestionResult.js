import classes from "../style/QuestionResult.module.css";
import React from "react";


function QuestionResult(props) {
    return (
        <div className={classes.card}>{props.children}
        </div>
    );
}

export default QuestionResult;
