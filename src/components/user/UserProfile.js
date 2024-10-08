import React, {useEffect, useRef, useState} from 'react';
import classes from '../style/UserProfile.module.css';
import {apiRequest} from "../../apiServer/api";

const UserProfile = ({ show, user, onLogout, onEditProfile }) => {
    const [myUser, setMyUser] = useState(null);
    const [showAvt, setShowAvt] = useState(true);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setMyUser(data);
                // console.log("User data:", data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserData();
    }, []);
    if (!myUser || !myUser.avatar || !showAvt) {
        return null;
    }


    const baseUrl = 'http://127.0.0.1:8080';


    const avatarUrl = new URL(`${baseUrl}/${myUser.avatar}`);

    if (!show) {
        return null;
    }

    return (
        <div className={classes.dropdown}>
            <div className={classes.avatar}>
                <img src={avatarUrl} alt="User Avatar" width="50" height="50" />
                <div className={classes.user_details}>
                    <div className={classes.user_info}><strong>نام کاربری:</strong> {user.username}</div>
                    <div className={classes.user_info}><strong>نام:</strong> {user.name}</div>
                    <div className={classes.user_info}><strong>شماره تلفن:</strong> {user.phone}</div>
                </div>
            </div>
            <div className={classes.actions}>
                <button className={classes.profile_button} onClick={onEditProfile}>ویرایش اطلاعات</button>
                <button className={classes.exitBtn} onClick={onLogout}>خروج</button>
            </div>
        </div>
    );
};

export default UserProfile;
