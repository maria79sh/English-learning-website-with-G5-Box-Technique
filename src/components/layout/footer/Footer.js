import classes from "../../style/footer.module.css";

function Footer() {
    return (
    <footer className={classes.footer}>
        <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg"
             className="transition duration-300 ease-in-out delay-150">

            <defs>
                <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="5%" stop-color="#00d084"></stop>
                    <stop offset="95%" stop-color="#8ED1FC"></stop>
                </linearGradient>
            </defs>
            <path
                d="M 0,400 L 0,150 C 101.25,175.21428571428572 202.5,200.42857142857142 305,214 C 407.5,227.57142857142858 511.25,229.5 659,196 C 806.75,162.5 998.5,93.57142857142857 1136,80 C 1273.5,66.42857142857143 1356.75,108.21428571428572 1440,150 L 1440,400 L 0,400 Z"
                stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1"
                className="transition-all duration-300 ease-in-out delay-150 path-0"></path>
        </svg>
    </footer>
    )
}

export default Footer;