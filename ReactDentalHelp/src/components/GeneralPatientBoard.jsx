import stylesVertical from '../assets/css/VerticalMenu.module.css';
import RequestAppointment from "./RequestAppointment.jsx";
import PatientAppointmentsHistory from "./PatientAppointmentsHistory.jsx";
import XrayPatient from "./XrayPatient.jsx";
import GeneralAnamnesis from "./GeneralAnamnesis.jsx";
import PatientPersonalDataPage from "./PatientPersonalDataPage.jsx";
import KidsMainPage from "./KidsMainPage.jsx";
import {useNavigate, useParams} from "react-router-dom";
import logo from "../assets/login_photo/tooth.png";
import NavBar from "./NavBar.jsx";
import pageStyle from "../assets/css/GeneralPatientBoardStyle.module.css"
import {useEffect, useState} from "react";
import HandleKidAccount from "./HandleKidAccount.jsx";
import CabServices from "./CabActivity.jsx";
import GeneralDentalStatus from "./GeneralDentalStatus.jsx"
import PatientAppointmentRequests from "./PatientAppointmentRequests.jsx";

const GeneralPatientBoard = () => {
    const { component } = useParams();
    const [activeComponent, setActiveComponent] = useState(null);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState({
        requests: false,
        personal: false,
    });
    const navigate = useNavigate();

    // Funcție pentru a obține componenta activă pe baza cheii
    const getActiveComponent = (key) => {
        switch (key) {
            case 'kids':
                navigate("/GeneralPatientBoard/kids", { replace: true });
                return <KidsMainPage />;
            case 'register-kids':
                return <HandleKidAccount />;
            case 'request':
                navigate("/GeneralPatientBoard/request", { replace: true });
                return <RequestAppointment />;
            case 'history':
                navigate("/GeneralPatientBoard/history", { replace: true });
                return <PatientAppointmentsHistory />;
            case 'status':
                navigate("/GeneralPatientBoard/status", { replace: true });
                return <GeneralDentalStatus/>
            case 'personal':
                navigate("/GeneralPatientBoard/personal", { replace: true });
                return <PatientPersonalDataPage />;
            case "cab-service":
                navigate("/GeneralPatientBoard/cab-service", { replace: true });
                return <CabServices/>
            case 'anamnesis':
                navigate("/GeneralPatientBoard/anamnesis", { replace: true });
                return <GeneralAnamnesis />;
            case 'xray':
                navigate("/GeneralPatientBoard/xray", { replace: true });
                return <XrayPatient />;
            default:
                return null;
        }
    };

    // Setează componenta activă pe baza parametru
    useEffect(() => {
        setActiveComponent(getActiveComponent(component));
    }, [component]);

    const handleLinkClick = (component) => {
        setActiveComponent(getActiveComponent(component));
    };

    // Funcție pentru a deschide/închide submenu-uri
    const toggleSubmenu = (menu) => {
        setIsSubmenuOpen((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    const goToHomeSection = (sectionId) => {
        navigate(`/#${sectionId}`);
    };

    return (
        <div className={pageStyle.container}>
            <nav className={stylesVertical.menu}>
                <a href="/" className={stylesVertical["logo"]}>
                    <img className={stylesVertical["logo"]} src={logo} alt="DENTHELP"/>
                    <p className={stylesVertical["logo-name"]}>DENT<br/>HELP</p>
                </a>
                <ul className={stylesVertical.menuItems}>
                    <li>
                        <a onClick={() => handleLinkClick('cab-service')} className={stylesVertical.category}>Serviciile cabinetului</a>
                    </li>
                    <li>
                        <a onClick={() => toggleSubmenu('requests')} className={stylesVertical.category}>
                            Programari
                        </a>
                        {isSubmenuOpen.requests && (
                            <ul className={stylesVertical.submenu}>
                                <li>
                                    <a onClick={() => handleLinkClick('request')}>Solicită o programare</a>
                                </li>
                                <li>
                                    <a onClick={() => handleLinkClick('history')}>Programările mele</a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <a onClick={() => toggleSubmenu('personal')} className={stylesVertical.category}>
                            Date personale
                        </a>
                        {isSubmenuOpen.personal && (
                            <ul className={stylesVertical.submenu}>
                                <li>
                                    <a onClick={() => handleLinkClick('personal')}>Date personale</a>
                                </li>
                                <li>
                                    <a onClick={() => handleLinkClick('anamnesis')}>Anamneza generala</a>
                                </li>
                                <li>
                                    <a onClick={() => handleLinkClick('xray')}>Radiografii</a>
                                </li>
                                <li>
                                    <a onClick={() => handleLinkClick('status')}>Status dentar</a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <a onClick={() => handleLinkClick('kids')} className={stylesVertical.category}>Copii</a>
                    </li>
                </ul>
                <div className={stylesVertical.footerMenu}>
                    <ul >
                        <li><button className={stylesVertical["footerMenuButtons"]}>Help</button></li>
                        <li><button className={stylesVertical["footerMenuButtons"]} onClick={() => goToHomeSection('contact')}>Contact</button></li>
                        <li><button className={stylesVertical["footerMenuButtons"]} onClick={() => goToHomeSection('history')}>Despre noi</button></li>
                        <li><button className={stylesVertical["footerMenuButtons"]} >Account</button></li>
                    </ul>
                </div>
            </nav>
            <div className={pageStyle["rightSide"]}>
                <NavBar></NavBar>
                {activeComponent}
            </div>
        </div>
    );
};

export default GeneralPatientBoard;
