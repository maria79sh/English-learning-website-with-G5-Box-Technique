import classes from "../../style/HeaderProfileButton.module.css"
import UserIcon from "../../user/UserIcon";
import {Fragment, useEffect, useRef, useState} from "react";
import {apiRequest} from "../../../apiServer/api";
import HeaderProfileButton from "./HeaderProfileButton";
import UserProfile from "../../user/UserProfile";
import {logout} from "../../../apiServer/authRevoke";
import UserInfo from "../../user/UserInfo";
import {useNavigate} from "react-router-dom";
import UserScores from "../../user/userScores";

const HeaderButton = (props) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [user, setUser] = useState(null);
    const [score, setScore] = useState(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScoreDropdownOpen, setIsScoreDropdownOpen] = useState(false);

    const handleIconClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleScoreIconClick = () => {
        setIsScoreDropdownOpen(!isScoreDropdownOpen);
    };
    const handleLogout = () => {
        logout();
        console.log('User logged out');
    };

    const handleEditProfile = () => {
        navigate('/editUser');

    };





    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setUser(data.name);
                setScore(data.score);
                setUserInfo(data);

            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
       fetchUserData();
    }, []);


    // if (!user) {
    //     logout();
    // }

    return (<Fragment>
        <div>
            <span className={classes.score}>        امتیاز شما :  </span>
            <UserScores
                show={isScoreDropdownOpen}
                user={userInfo}
            />
            <span className={classes.badge} onClick={handleScoreIconClick}> {JSON.stringify(score)} </span>
        </div>
        <div className={classes.dir}>


        <span>خوش آمدی </span>
        <span>, {JSON.stringify(user)}  </span>
            <UserProfile
                show={isDropdownOpen}
                user={userInfo}
                onLogout={handleLogout}
                onEditProfile={handleEditProfile}
            />
            <span className={classes.icon} onClick={handleIconClick}>
                <UserIcon/>
            </span>
    </div>
</Fragment>
)
    ;
}
export default HeaderButton;
