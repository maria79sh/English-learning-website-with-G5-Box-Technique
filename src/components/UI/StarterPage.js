import React from 'react';
import '../style/StarterPage.css';
import video from '../../assets/icons/welcome.mp4';

const StarterPage = () => {
    return (
        <div className="starter-page">
            <video className="starter-video"
                   src={video}
                autoPlay
                loop
                muted
                style={{ width: '100%', maxHeight: '500px' }}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default StarterPage;
