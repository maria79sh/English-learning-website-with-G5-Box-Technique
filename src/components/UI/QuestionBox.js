import classes from "../style/QuestionBox.module.css";
import React from "react";


function QuestionBox(props) {
    return (
        <div className={classes.card}>{props.children}</div>
    );
}

export default QuestionBox;
