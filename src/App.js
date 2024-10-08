import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {Fragment, useEffect, useState} from "react";
import HomePage from "./components/HomePage/HomePage";
import Vocab from "./components/learning/Vocab";
import Writing from "./components/learning/Writing";
import Listening from "./components/learning/Listening";
import UserLogin from "./components/user/UserLogin";
import UserInfo from "./components/user/UserInfo";

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Quiz from "./components/learning/Quiz";
import EditProfile from "./components/user/EditProfile";
import StarterPage from "./components/UI/StarterPage";
import WritingRoute from "./components/learning/WritingRoute";
import G5 from "./components/learning/G5";
import Grammar from "./components/learning/Grammar";
import Spelling from "./components/learning/Spelling";
import ProtectedRoute from "./ProtectedRoute";

function App() {

    const [showStarterPage, setShowStarterPage] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowStarterPage(false);
        }, 4000); // Show the starter page for (5 seconds)
    }, []);

    if (showStarterPage) {
        return <StarterPage />;
    }



     return (
         <Router>
             <div>
                 <Routes>
                     <Route path="/login" element={<UserLogin/>} />
                     <Route path="/userInfo" element={<ProtectedRoute component={UserInfo} />} />
                     <Route path="/Vocab" element={<ProtectedRoute component={() => <Vocab/>} />} />
                     <Route path="/Writing" element={<ProtectedRoute component={() => <WritingRoute/>} />} />
                     <Route path="/SpellingMode" element={<ProtectedRoute component={() => <Spelling/>} />} />
                     <Route path="/writingMode" element={<ProtectedRoute component={() => <Writing/>} />} />
                     <Route path="/home" element={<ProtectedRoute component={HomePage} />} />
                     <Route path="/quiz" element={<ProtectedRoute component={Quiz} />} />
                     <Route path="/editUser" element={<ProtectedRoute component={EditProfile} />} />
                     <Route path="/Listening" element={<ProtectedRoute component={() => <Listening/>} />} />
                     <Route path="/grammar" element={<ProtectedRoute component={Grammar} />} />
                     <Route path="/g5" element={<ProtectedRoute component={G5} />} />
                     <Route path="/" element={<ProtectedRoute component={HomePage} />} />

                     <Route path="*" element={<ProtectedRoute to="/login" />} />
                 </Routes>
             </div>
         </Router>
     );
 };



export default App;
