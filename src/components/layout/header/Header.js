import React from "react";
import {Fragment} from "react";
import  "../../style/Header.css";
import HeaderButton from "./HeaderProfileButton";
import {Link} from "react-router-dom";
// import classes from "../../style/HeaderProfileButton.module.css";
import UserIcon from "../../user/UserIcon";

import flashcard from "../../../assets/icons/flashcard.svg";
import leitner from "../../../assets/icons/leitner.png";
import home from "../../../assets/icons/home.png";

function Header() {
    const onMenuClick = () => {
            var navbar = document.getElementById("navigation-bar");
            var responsive_class_name = "responsive";

            navbar.classList.toggle(responsive_class_name);
    }
    return (

        <Fragment>
            <header className="header">

                <div className="headerTitle" >
                    <Link to="/" className="header-title">
                        {/*صفحه اصل ی*/}
                        <img src={home}/>
                    </Link>
                </div>
                <div className="headerG5" >
                      {/*<span className={classes.icon} >*/}
                {/*<G5Icon/>*/}
            {/*</span>*/}
                    <Link to="/g5" className="header-title">
                        {/*جعبه لایتنر(G5)*/}
                    {/*    <img src={flashcard}/>*/}
                    <img src={leitner}/>

                    </Link>
                </div>
                <div className="header-content">
                    <HeaderButton />
                </div>
            </header>

            <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg"
                 className="transition duration-300 ease-in-out delay-150">

                <defs>
                    <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                        <stop offset="5%" stop-color="#07ba5d"></stop>
                        <stop offset="95%" stop-color="#8ED1FC"></stop>
                    </linearGradient>
                </defs>
                <path
                    d="M 0,400 L 0,100 C 156.40000000000003,92.8 312.80000000000007,85.6 486,78 C 659.1999999999999,70.4 849.2,62.400000000000006 1011,66 C 1172.8,69.6 1306.4,84.8 1440,100 L 1440,400 L 0,400 Z"
                    stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.53"
                    className="transition-all duration-300 ease-in-out delay-150 path-0"
                    transform="rotate(-180 720 200)"></path>

                <defs>
                    <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                        <stop offset="5%" stop-color="#07ba5d"></stop>
                        <stop offset="95%" stop-color="#8ED1FC"></stop>
                    </linearGradient>
                </defs>
                <path
                    d="M 0,400 L 0,233 C 117.86666666666667,219.26666666666665 235.73333333333335,205.53333333333333 408,199 C 580.2666666666667,192.46666666666667 806.9333333333334,193.13333333333333 988,200 C 1169.0666666666666,206.86666666666667 1304.5333333333333,219.93333333333334 1440,233 L 1440,400 L 0,400 Z"
                    stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1"
                    className="transition-all duration-300 ease-in-out delay-150 path-1"
                    transform="rotate(-180 720 200)"></path>
            </svg>


            {/*</div>*/}
        </Fragment>
    );


}

export default Header;
