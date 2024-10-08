import Layout from "../layout/Layout";
import StudyCard from "../UI/StudyCard";
import classes from "../style/WRoute.module.css";
import {Fragment} from "react";
import {useNavigate} from "react-router-dom";

const WritingRoute = () => {

    const navigate = useNavigate();

    const handleOption = () => {
        navigate('/writingMode');

    };

    const handleSpelling = () => {
        navigate('/spellingMode');
    };
    return (
        <Fragment>
            <Layout></Layout>
            <StudyCard>
                <div className={classes.choiceDiv}>
                    <button className={classes.buttonChoice} onClick={handleOption} role="button">گزینه درست رو انتخاب کن! </button>
                    <button className={classes.buttonChoice} onClick={handleSpelling} role="button">جواب درست رو تایپ کن!</button>
                </div>
            </StudyCard>
        </Fragment>
    );
};

export default WritingRoute;