import "bootstrap/dist/css/bootstrap.min.css"
import "../style/Cup.css";
import {Link} from "react-router-dom";
import noCup from "../../assets/icons/noCup.png";
import starCup from "../../assets/icons/starCup.png";
import starCup2 from "../../assets/icons/star2Cup.png";
import starCup3 from "../../assets/icons/star3Cup.png";
import goldCup from "../../assets/icons/goldCup.png";
import diamondCup from "../../assets/icons/diamondCup.png";
import starGoldCup from "../../assets/icons/starGoldCup.png";

import {apiRequest} from "../../apiServer/api";
import {useEffect, useState} from "react";

const Cup = () => {
    const [cup, setCup] = useState(null);
    const [cupTitle, setCupTitle] = useState(null);

    useEffect(() => {
        const fetchCupData = async () => {
            try {
                const data = await apiRequest('http://127.0.0.1:8080/api/v1/current_user');
                setCup(data.cup_id);
                console.log("cup is   "  , data.cup_id  )
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchCupData();
    }, []);


    // Render different content based on the cup_id

        const cupContent = {

            1: <h2> شما صاحب هیچ جامی نیستید ! </h2>,
            2: <h2> شما صاحب جام تک ستاره هستید ! </h2>,
            3: <h2> شما صاحب جام دو ستاره هستید ! </h2>,
            4: <h2> شما صاحب جام سه ستاره هستید ! </h2>,
            5: <h2> شما صاحب جام طلایی هستید ! </h2>,
            6: <h2> شما صاحب جام ستاره طللایی هستید ! </h2>,
            7: <h2> شما صاحب جام الماس هستید ! </h2>,

        };

    const cupImg = {

        1: <img className="cupImg" src={noCup} alt="no Cup"/>,
        2: <img className="cupImg" src={starCup} alt="starCup"/>,
        3: <img className="cupImg" src={starCup2} alt="sec Cup"/>,
        4: <img className="cupImg" src={starCup3} alt="first Cup"/>,
        5: <img className="cupImg" src={goldCup} alt="goldCup"/>,
        6: <img className="cupImg" src={starGoldCup} alt="starGold"/>,
        7: <img className="cupImg" src={diamondCup} alt="diamondCup"/>,

    };

        const renderCupContent = () => {
            if (cup === null) {
                return <p>Loading...</p>;
            }
            return cupContent[cup]
        };

    const renderCupImg = () => {
        if (cup === null) {
            return <p>Loading...</p>;
        }
        return cupImg[cup];
    };

    return (
       <div className="userTitleDiv">
           <div className="userTitle">
               {renderCupContent()}
           </div>
           <div className="divCircle">
               {renderCupImg()}
           </div>
           <div className="cupTest">
               <button> <Link to="/quiz" >جام بعدی رو به دست بیار! </Link></button>
           </div>
       </div>
    );
};

export default Cup;
