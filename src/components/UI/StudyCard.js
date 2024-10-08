import classes from "../style/StudyCard.module.css";
import React from "react";


function StudyCard(props) {
    return (
        <div className={classes.card}>{props.children}</div>
    );
}

export default StudyCard;
