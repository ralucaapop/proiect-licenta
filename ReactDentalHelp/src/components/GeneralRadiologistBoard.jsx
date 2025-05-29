import stylesVertical from '../assets/css/VerticalMenu.module.css';
import {useNavigate, useParams} from "react-router-dom";
import logo from "../assets/login_photo/tooth.png";
import NavBar from "./NavBar.jsx";
import pageStyle from "../assets/css/GeneralPatientBoardStyle.module.css"
import React, {useEffect, useState} from "react";
import Scheduler from "./Scheduler.jsx";
import ConfirmAppointments from "./ConfirmAppointments.jsx";
import NotificationsAdmin from "./NotificationsAdmin.jsx";
import PatientsDoctor from "./PatientsDoctor.jsx";
import {Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import moment from "moment";
import CabActivity from "./CabActivity.jsx";
import styles from "../assets/css/Scheduler.module.css";
import RegisterNewUser from "./RegisterNewUser.jsx";
import PatientsForRadiologist from "./PatientsForRadiologist.jsx";

const GeneralRadiologistBoard = () => {
    const { component } = useParams();
    const [activeComponent, setActiveComponent] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatientCNP, setSelectedPatientCNP] = useState(''); // State for selected patient CNP
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BACKEND_URL;


    const getActiveComponent = (key) => {
        switch (key) {
            case 'patientsXrays':
                navigate("/GeneralRadiologistBoard/patientsXrays", { replace: true });
                return <PatientsForRadiologist/>;
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


    const goToHomeSection = (sectionId) => {
        navigate(`/#${sectionId}`);
    };

    const fetchPatients = async () =>{
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get(baseUrl+'/api/admin/patient/get-patients', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            if (Array.isArray(data)) {
                const apiPatients = data.map((patient) => ({
                    patientFirstName: patient.firstName,
                    patientSecondName: patient.lastName,
                    patientCnp: patient.cnp
                }));
                console.log(data)
                setPatients(apiPatients); // Setează evenimentele preluate în starea `events`
            } else {
                console.error('Datele primite despre pacienti nu sunt un array:', data);
            }
        } catch (error) {
            console.error('Eroare la preluarea evenimentelor:', error);
        }
    };


    useEffect(() => {
        fetchPatients();
    }, []);


    return (
        <div className={pageStyle.container}>
            <nav className={stylesVertical.menu}>
                <a href="/" className={stylesVertical["logo"]}>
                    <img className={stylesVertical["logo"]} src={logo} alt="DENTHELP"/>
                    <p className={stylesVertical["logo-name"]}>DENT<br/>HELP</p>
                </a>
                <ul className={stylesVertical.menuItems}>
                    <li>
                        <a onClick={() => handleLinkClick('patientsXrays')} className={stylesVertical.category}>Pacienți</a>
                    </li>
                </ul>
                <div className={stylesVertical.footerMenu}>
                    <ul>
                        <li><button className={stylesVertical["footerMenuButtons"]} onClick={() => goToHomeSection('contact')}>Contact</button></li>
                        <li><button className={stylesVertical["footerMenuButtons"]} onClick={() => goToHomeSection('history')}>Despre noi</button></li>
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

export default GeneralRadiologistBoard;
