import React, {useEffect, useRef, useState} from "react";
import "../../../assets/css/bootstrap.min.css";
import "../../style/Sidebar.css";
// import sidebarIcon from "../../../assets/sidebarIcon.png"
// import sidebarFooterIcon from "../../../assets/sidebarFooterIcon.png"
import {Link} from "react-router-dom";

// import 'react-sidebar-ui/dist/index.css';

const  WebsiteSidebar = ({ onClose }) => {
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose(); // Close the sidebar when clicking outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);


    const [isOpen, setIsOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSubMenuToggle = (menu) => {
        setActiveSubMenu(activeSubMenu === menu ? null : menu);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}` } ref={sidebarRef}>
            {/*<button className="toggle-button" onClick={handleToggle}>*/}
            {/*    ☰*/}
            {/*</button>*/}
            <button className="button-41 toggle-button" role="button" onClick={handleToggle}></button>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <Link to="/G5"> جعبه لایتنر </Link>
                    </li>
                    <li>
                        {/*<button className="menu-button" onClick={() => handleSubMenuToggle('menu1')}>*/}
                        {/*    معنی لغت*/}
                        {/*</button>*/}
                        {/*<ul className={`submenu ${activeSubMenu === 'menu1' ? 'open' : ''}`}>*/}
                        {/*    <li><Link to="/sub1">Submenu 1</Link></li>*/}
                        {/*    <li><Link to="/sub2">Submenu 2</Link></li>*/}
                        {/*</ul>*/}

                        <Link to="/vocab">معنی لغت</Link>

                    </li>
                    <li>
                        <Link to="/grammar">گرامر</Link>

                    </li>
                    <li>
                        <Link to="/writing">نوشتار و دیکته</Link>

                    </li>

                    <li>
                        <Link to="/listening">تمرین شنیداری</Link>


                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default WebsiteSidebar;
