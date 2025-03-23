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
import CabServices from "./CabServices.jsx";
import GeneralDentalStatus from "./GeneralDentalStatus.jsx"
import PatientAppointmentRequests from "./PatientAppointmentRequests.jsx";
import Chatbot from "./Chatbot.jsx";
import hamburger_icon from "../assets/icons/hamburger.png"
import kids from "../assets/icons/children.png"
import appointment from "../assets/icons/appointment.png"
import personal_info from "../assets/icons/personal-information.png"
import dental_service from "../assets/icons/dental-service.png"
import PatientPersonalData from "./PatientPersonalData.jsx";
import styles from "../assets/css/NavBar.module.css";
import {addResponseMessage, Widget} from "react-chat-widget";

const GeneralPatientBoard = () => {

    const [isOpen, setIsOpen] = useState(false);
    const API_KEY ="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";
    const [messages, setMessages] = useState([
        {
            message:"Bună ziua! Cu ce vă pot ajuta?",
            sender: "ChatGPT"
        }
    ])

    const handleSend = async (message) =>{
        const newMessage = {
            message: message,
            sender: "user"
        }

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        console.log(newMessages)
        await processMessageToChatGPT(newMessages);
    }

    async function processMessageToChatGPT(chatMessages){
        let apiMessages = chatMessages.map((messageObject) =>{
            let role = "";
            if(messageObject.sender === "ChatGPT"){
                role="assistant"
            }
            else{
                role = "user"
            }
            return {role:role, content: messageObject.message}
        });

        const requirements = "I want you to act like you are a dental assistant. Give short answers and respond in the language that the user addresses you." +
            "If the user asks about medical advices give him some short advice, but remind him that he always should contact a doctor." +
            "Respond just to question related to dental problems and information about the cabinet, if there is another type of question please say that you can not help." +
            "Now, there are the cabinet information: The address is: Strada Gheorghe Lazăr 12, Timisoara, the program: every monday to saturday from 7 am. to 8 pm. " +
            "The cabinet services can be find in our website." +
            " Contact information: tel: 0721321111, email: contact@denthelp.ro. For appointments use the special section from our website, or call by number."

        const systemMessage = {
            role: "system",
            content: requirements
        }

        const apiRequestBody={
            "model" : "gpt-3.5-turbo",
            "messages" : [systemMessage,
                ...apiMessages]
        }

        await fetch("https://api.openai.com/v1/chat/completions",{
            method : "POST",
            headers:{
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) =>{
            return data.json();
        }).then((data) =>{
            setMessages([...chatMessages, {
                message: data.choices[0].message.content,
                sender: "ChatGPT"
            }])
            addResponseMessage(data.choices[0].message.content);
        });

    }

    const handleNewUserMessage = (newMessage) => {
        handleSend(newMessage)
    };

    const { component } = useParams();
    const [activeComponent, setActiveComponent] = useState(null);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState({
        requests: false,
        personal: false,
    });
    const navigate = useNavigate();

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
                return <PatientPersonalData/>;
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

    const [window, setWindow] = useState(false);

    const openClose = () => {
        if (window === false) {
            setWindow(true);
        } else {
            setWindow(false);
        }
    };
    const handleLogout = () =>{
        localStorage.removeItem("token")
        navigate('/')
    }
    return (
        <div className={pageStyle.container}>
            <nav className={stylesVertical.menu} style={{width: window === false ? 220 : 35}}>
                <div className={stylesVertical["burger"]} onClick={() => openClose()}>
                    <img src={hamburger_icon} alt="burger" className={stylesVertical.hamburgerImg}/>
                </div>
                <div>
                    <a href="/" className={stylesVertical["logo"]}>
                        <img className={stylesVertical["logo"]} src={logo} alt="DENTHELP"/>
                        <p className={stylesVertical["logo-name"]}>DENT<br/>HELP</p>
                    </a>
                    <ul className={stylesVertical.menuItems}>
                        <li className={stylesVertical.menuItem}>
                            <img src={dental_service} className={stylesVertical.verticalIcon}/>
                            <a onClick={() => handleLinkClick('cab-service')} className={stylesVertical.category}>Serviciile
                                cabinetului</a>
                        </li>
                        <li >
                            <div className={stylesVertical.menuItem}>
                            <img src={appointment} className={stylesVertical.verticalIcon}/>

                            <a onClick={() => toggleSubmenu('requests')} className={stylesVertical.category}>
                                Programări
                            </a>
                            </div>
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
                        <li >
                            <div className={stylesVertical.menuItem}>
                            <img src={personal_info} className={stylesVertical.verticalIcon}/>
                            <a onClick={() => toggleSubmenu('personal')} className={stylesVertical.category}>
                                Date personale
                            </a>
                            </div>
                            {isSubmenuOpen.personal && (
                                <ul className={stylesVertical.submenu}>
                                    <li>
                                        <a onClick={() => handleLinkClick('personal')}>Date personale</a>
                                    </li>
                                    <li>
                                        <a onClick={() => handleLinkClick('anamnesis')}>Anamneza generală</a>
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
                        <li className={stylesVertical.menuItem}>
                            <img src={kids} className={stylesVertical.verticalIcon}/>
                            <a onClick={() => handleLinkClick('kids')} className={stylesVertical.category}>Copii</a>
                        </li>
                    </ul>
                    <div className={stylesVertical.footerMenu}>
                        <ul>
                            <li>
                                <button className={stylesVertical["footerMenuButtons"]}
                                        onClick={() => goToHomeSection('contact')}>Contact
                                </button>
                            </li>
                            <li>
                                <button className={stylesVertical["footerMenuButtons"]}
                                        onClick={() => goToHomeSection('history')}>Despre noi
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleLogout()} className={stylesVertical["footerMenuButtons"]}>Deconectare
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className={pageStyle["rightSide"]}>
                {activeComponent}
            </div>
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Asistentul virtual"
                subtitle="Cum vă putem ajuta?"
                open={isOpen}
                handleToggle={() => setIsOpen(!isOpen)}
            />
        </div>
    );
};

export default GeneralPatientBoard;
