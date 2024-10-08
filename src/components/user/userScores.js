import React, {useEffect, useRef, useState} from 'react';
import classes from '../style/UserScore.module.css';
import {apiRequest} from "../../apiServer/api";

const UserScore = ({ show, user,  }) => {
    const [myUser, setMyUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setMyUser(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);


    if (!show) {
        return null;
    }


    return (
        <div className={classes.scoreDropDown}>
            <div className={classes.scores}>
                <div className={classes.firstRow}>
                    <div className={classes.userLevel}><strong>سطح شما :     </strong>
                        {JSON.stringify(user.level)}</div>
                    <div className={classes.scoreTitle}>
                    Vocab :
                    </div>
                    <div className={classes.user_info}><strong>جواب های صحیح :</strong>
                        {JSON.stringify(user.vocab.correct_answers)}</div>
                    <div className={classes.user_info}><strong>جواب های نادرست :</strong>
                        {JSON.stringify(user.vocab.wrong_answers)}</div>
                    <div className={classes.scoreTitle}>
                      Grammar :
                    </div>
                    <div className={classes.user_info}><strong>جواب های صحیح :</strong>
                        {JSON.stringify(user.grammar.correct_answers)}</div>
                    <div className={classes.user_info}><strong>جواب های نادرست :</strong>
                        {JSON.stringify(user.grammar.wrong_answers)}</div>
                    <div className={classes.scoreTitle}>
                        Listening :
                    </div>
                    <div className={classes.user_info}><strong>جواب های صحیح :</strong>
                        {JSON.stringify(user.listening.correct_answers)}</div>
                    <div className={classes.user_info}><strong>جواب های نادرست :</strong>
                        {JSON.stringify(user.listening.wrong_answers)}</div>
                </div>
                <div className={classes.secondRow}>
                    <div className={classes.userLevel}><strong>جام :    </strong>
                        {JSON.stringify(user.cup_id)} از ۷</div>
                    <div className={classes.scoreTitle}>
                        Writing :
                    </div>
                    <div className={classes.user_info}><strong>جواب های صحیح :</strong>
                        {JSON.stringify(user.writing.correct_answers)}</div>
                    <div className={classes.user_info}><strong>جواب های نادرست :</strong>
                        {JSON.stringify(user.writing.wrong_answers)}</div>
                    <div className={classes.scoreTitle}>
                       spelling :
                    </div>
                    <div className={classes.user_info}><strong>جواب های صحیح :</strong>
                        {JSON.stringify(user.spelling.correct_answers)}</div>
                    <div className={classes.user_info}><strong>جواب های نادرست :</strong>
                        {JSON.stringify(user.spelling.wrong_answers)}</div>

                    <div className={classes.actions}>
                        {/*<button className={classes.exitBtn} >بستن</button>*/}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default UserScore;
