import React from "react";
import {Fragment} from "react";
import classes from "../style/HomePage.module.css";
import Header from "../layout/header/Header";
import Level from "../level/Level";
import Layout from "../layout/Layout";

function HomePage() {
    return (
        <Fragment>

            <Layout></Layout>
            <Level>
            </Level>
            <footer className={classes.footer}>
                <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg"
                     className="transition duration-300 ease-in-out delay-150">

                    <defs>
                        <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                            <stop offset="5%" stop-color="#07ba5d"></stop>
                            <stop offset="95%" stop-color="#e0f2e9"></stop>
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0,400 L 0,0 C 86.96428571428572,35.17857142857143 173.92857142857144,70.35714285714286 295,85 C 416.07142857142856,99.64285714285714 571.2499999999999,93.75000000000001 720,92 C 868.7500000000001,90.24999999999999 1011.0714285714287,92.64285714285714 1130,78 C 1248.9285714285713,63.35714285714286 1344.4642857142858,31.67857142857143 1440,0 L 1440,400 L 0,400 Z"
                        stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.4"
                        className="transition-all duration-300 ease-in-out delay-150 path-0"></path>

                    <defs>
                        <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                            <stop offset="5%" stop-color="#07ba5d"></stop>
                            <stop offset="95%" stop-color="#e0f2e9"></stop>
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0,400 L 0,0 C 118,77.32142857142857 236,154.64285714285714 356,173 C 476,191.35714285714286 598.0000000000001,150.74999999999997 725,146 C 851.9999999999999,141.25000000000003 984,172.35714285714286 1104,154 C 1224,135.64285714285714 1332,67.82142857142857 1440,0 L 1440,400 L 0,400 Z"
                        stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.53"
                        className="transition-all duration-300 ease-in-out delay-150 path-1"></path>

                    <defs>
                        <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                            <stop offset="5%" stop-color="#07ba5d"></stop>
                            <stop offset="95%" stop-color="#e0f2e9"></stop>
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0,400 L 0,0 C 88.14285714285714,103.64285714285714 176.28571428571428,207.28571428571428 293,244 C 409.7142857142857,280.7142857142857 554.9999999999999,250.5 688,255 C 821.0000000000001,259.5 941.7142857142858,298.7142857142857 1065,262 C 1188.2857142857142,225.28571428571428 1314.142857142857,112.64285714285714 1440,0 L 1440,400 L 0,400 Z"
                        stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1"
                        className="transition-all duration-300 ease-in-out delay-150 path-2"></path>
                </svg>
            </footer>

        </Fragment>
    );
}

export default HomePage;
