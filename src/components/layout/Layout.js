import React, {useEffect, useRef, useState} from "react";
import {Fragment} from "react";
import Header from "./header/Header";
import WebsiteSidebar from "./sidebar/WebsiteSidebar";
// import Footer from "./footer/Footer";

function Layout() {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                handleCloseSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Fragment>
            <Header></Header>
            <WebsiteSidebar  isOpen={isSidebarOpen} onClose={handleCloseSidebar} ref={sidebarRef} ></WebsiteSidebar>
        </Fragment>
    );
}

export default Layout;
