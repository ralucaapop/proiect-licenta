import style from "../assets/css/TeethStatus.module.css"
import t11 from "../assets/tooth/11.png";
import t12 from "../assets/tooth/12.png";
import t13 from "../assets/tooth/13.png";
import t14 from "../assets/tooth/14.png";
import t15 from "../assets/tooth/15.png";
import t16 from "../assets/tooth/16.png";
import t17 from "../assets/tooth/17.png";
import t18 from "../assets/tooth/18.png";
import t21 from "../assets/tooth/21.png";
import t22 from "../assets/tooth/22.png";
import t23 from "../assets/tooth/23.png";
import t24 from "../assets/tooth/24.png";
import t25 from "../assets/tooth/25.png";
import t26 from "../assets/tooth/26.png";
import t27 from "../assets/tooth/27.png";
import t28 from "../assets/tooth/28.png";
import t31 from "../assets/tooth/31.png";
import t32 from "../assets/tooth/32.png";
import t33 from "../assets/tooth/33.png";
import t34 from "../assets/tooth/34.png";
import t35 from "../assets/tooth/35.png";
import t36 from "../assets/tooth/36.png";
import t37 from "../assets/tooth/37.png";
import t38 from "../assets/tooth/38.png";
import t41 from "../assets/tooth/41.png";
import t42 from "../assets/tooth/42.png";
import t43 from "../assets/tooth/43.png";
import t44 from "../assets/tooth/44.png";
import t45 from "../assets/tooth/45.png";
import t46 from "../assets/tooth/46.png";
import t47 from "../assets/tooth/47.png";
import t48 from "../assets/tooth/48.png";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {parseJwt} from "../service/authService.jsx";
import tooth_photo from "../assets/icons/tooth.png";



const GeneralDentalStatus = () =>{

    const [selectedTeeth, setSelectedTeeth] = useState(null);
    const [teethHistory, setTeethHistory] = useState([]);
    const [selectedIntervention, setSelectedIntervention] = useState(null);


    const getTeethHistory = async (teethId) =>{
        try {
            const token = localStorage.getItem('token');
            const decodedToken = parseJwt(token)
            const cnp = decodedToken.cnp
            const response = await axios.get(
                `http://localhost:8080/api/in/teeth/get_patient_tooth_history/${cnp}/${teethId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                console.log(response.data.data)
                setTeethHistory(response.data.data)
            } else {
                console.error('Eroare la preluarea interventiilor dintelui');
            }
        } catch (error) {
            console.error(`Eroare la preluarea intervențiilor asupra dintelui ${setTeethHistory()}`, error);
        }
    };

    useEffect(() => {

    }, );

    const handleTeethClick =  (teethId) => {
        setSelectedTeeth(teethId);
        getTeethHistory(teethId);
        setSelectedIntervention(null);
    }

    const handleInterventionClick = (intervention) =>{
        setSelectedIntervention(intervention);
    }

return (
    <div className={style["page"]}>
        <div className={style["status"]}>
            <div className={style["upperPart"]}>

                <div className={style["firstUpperPart"]}>
                    <img onClick={() => handleTeethClick(18)} className={style["t18"]} src={t18} alt="kid"/>
                    <img onClick={() => handleTeethClick(17)} className={style["t17"]} src={t17} alt="kid"/>
                    <img onClick={() => handleTeethClick(16)} className={style["t16"]} src={t16} alt="kid"/>
                    <img onClick={() => handleTeethClick(15)} className={style["t15"]} src={t15} alt="kid"/>
                    <img onClick={() => handleTeethClick(14)} className={style["t14"]} src={t14} alt="kid"/>
                    <img onClick={() => handleTeethClick(13)} className={style["t13"]} src={t13} alt="kid"/>
                </div>
                <div className={style["upperMiddlePart"]}>
                    <img onClick={() => handleTeethClick(12)} className={style["t12"]} src={t12} alt="kid"/>
                    <img onClick={() => handleTeethClick(11)} className={style["t11"]} src={t11} alt="kid"/>

                    <img onClick={() => handleTeethClick(21)} className={style["t21"]} src={t21} alt="kid"/>
                    <img onClick={() => handleTeethClick(22)} className={style["t22"]} src={t22} alt="kid"/>
                </div>
                <div className={style["lastUpperPart"]}>
                    <img onClick={() => handleTeethClick(23)} className={style["t23"]} src={t23} alt="kid"/>
                    <img onClick={() => handleTeethClick(24)} className={style["t24"]} src={t24} alt="kid"/>
                    <img onClick={() => handleTeethClick(25)} className={style["t25"]} src={t25} alt="kid"/>
                    <img onClick={() => handleTeethClick(26)} className={style["t26"]} src={t26} alt="kid"/>
                    <img onClick={() => handleTeethClick(27)} className={style["t27"]} src={t27} alt="kid"/>
                    <img onClick={() => handleTeethClick(28)} className={style["t28"]} src={t28} alt="kid"/>
                </div>
            </div>
            <div className={style["oblique-line"]}></div>
            <div className={style["downPart"]}>
                <div className={style["firstDownPart"]}>
                    <img onClick={() => handleTeethClick(38)} className={style["t38"]} src={t38} alt="kid"/>
                    <img onClick={() => handleTeethClick(37)} className={style["t37"]} src={t37} alt="kid"/>
                    <img onClick={() => handleTeethClick(36)} className={style["t36"]} src={t36} alt="kid"/>
                    <img onClick={() => handleTeethClick(35)} className={style["t35"]} src={t35} alt="kid"/>
                    <img onClick={() => handleTeethClick(34)} className={style["t34"]} src={t34} alt="kid"/>
                    <img onClick={() => handleTeethClick(33)} className={style["t33"]} src={t33} alt="kid"/>
                </div>

                <div className={style["middleDownPart"]}>
                    <img onClick={() => handleTeethClick(32)} className={style["t32"]} src={t32} alt="kid"/>
                    <img onClick={() => handleTeethClick(31)} className={style["t31"]} src={t31} alt="kid"/>
                    <img onClick={() => handleTeethClick(41)} className={style["t41"]} src={t41} alt="kid"/>
                    <img onClick={() => handleTeethClick(42)} className={style["t42"]} src={t42} alt="kid"/>
                </div>

                <div className={style["lastDownPart"]}>
                    <img onClick={() => handleTeethClick(43)} className={style["t43"]} src={t43} alt="kid"/>
                    <img onClick={() => handleTeethClick(44)} className={style["t44"]} src={t44} alt="kid"/>
                    <img onClick={() => handleTeethClick(45)} className={style["t45"]} src={t45} alt="kid"/>
                    <img onClick={() => handleTeethClick(46)} className={style["t46"]} src={t46} alt="kid"/>
                    <img onClick={() => handleTeethClick(47)} className={style["t47"]} src={t47} alt="kid"/>
                    <img onClick={() => handleTeethClick(48)} className={style["t48"]} src={t48} alt="kid"/>
                </div>
            </div>
        </div>
        <div className={style["details"]}>
            {selectedTeeth === null ?
                (
                    <div>
                        <p className={style["text-no"]}>
                            Selectati un dinte pentru a afla mai multe detalii despre acesta.
                        </p>
                    </div>
                ): (
                    <div>
                        <h2>Detaliile dintelui {selectedTeeth}</h2>
                        <h4>Istoric interventii</h4>

                        <div className={style["teeth-history"]}>
                            {
                                Array.isArray(teethHistory) && teethHistory.length > 0 ? (
                                    teethHistory.map((intervention) => (

                                        <li
                                            key={intervention.interventionId}
                                            onClick={() => handleInterventionClick(intervention)}
                                            className={style[selectedIntervention && selectedIntervention.interventionId === intervention.interventionId ? 'active' : "list-element"]}
                                        >
                                            <div className={style['intervention']}>
                                                <div className={style['left-part']}>
                                                    <img className={style['appointment-img']} src={tooth_photo}
                                                         alt="Appointment Icon"/>
                                                    <p>{intervention.dateIntervention}</p>
                                                </div>
                                            </div>
                                        </li>

                                    ))
                                ) : (
                                    <div>
                                        <p className={style["text-no"]}>Nu exista nici o interventie asupra acestui
                                            dinte</p>
                                    </div>
                                )
                            }
                        </div>
                        {selectedIntervention &&(
                            <div className={style["intervention-details"]}>
                                <p className={style["details-text"]}>Detalii Interventie:</p>
                                <p className={style["details-text"]}>{selectedIntervention.interventionDetails}</p>
                            </div>
                        )}

                    </div>
                )}
        </div>
    </div>
);
}
export default GeneralDentalStatus