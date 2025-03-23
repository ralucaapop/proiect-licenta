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
import hamburger_icon from "../assets/icons/hamburger.png";
import dental_service from "../assets/icons/dental-service.png";
import appointment from "../assets/icons/appointment.png"
import cab_activity from "../assets/icons/dentistry.png"
import notification_photo from "../assets/icons/notification.png"
import patients_photo from "../assets/icons/patient.png"
import resume from "../assets/icons/resume.png"
import medicine from "../assets/icons/medicine.png"
import Consultant from "./Consultant.jsx";
const GeneralPatientBoard = () => {
    const { component } = useParams();
    const [activeComponent, setActiveComponent] = useState(null);
    const [manualModalIsOpen, setManualModalIsOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatientCNP, setSelectedPatientCNP] = useState(''); // State for selected patient CNP
    const [appointmentReason, setAppointmentReason] = useState(null);

    const [isSubmenuOpen, setIsSubmenuOpen] = useState({
        appointments: false,
    });
    const navigate = useNavigate();
    const externPatientCnp = location.state?.patientCnp;

    // Funcție pentru a obține componenta activă pe baza cheii
    const getActiveComponent = (key) => {
        switch (key) {
            case 'appointments':
                navigate("/GeneralAdminBoard/appointments", { replace: true });
                return <Scheduler/>;
            case "request":
                navigate("/GeneralAdminBoard/request", { replace: true });
                return <ConfirmAppointments/>;
            case "notifications":
                navigate("/GeneralAdminBoard/notifications", { replace: true });
                return <NotificationsAdmin/>
            case "patients":
                navigate("/GeneralAdminBoard/patients", { replace: true });
                return <PatientsDoctor/>;
            case "specific-patient":
                return <PatientsDoctor/>
            case "cab-activity":
                navigate("/GeneralAdminBoard/cab-activity", { replace: true });
                return <CabActivity/>
            case "register_people":
                navigate("/GeneralAdminBoard/register_people", { replace: true });
                return <RegisterNewUser/>
            case "addAppointment":
                openManualModal()
                navigate("/GeneralAdminBoard/appointments", { replace: true });
                return <Scheduler/>;
            case "consultant":
                navigate("/GeneralAdminBoard/consultant", { replace: true });
                return <Consultant></Consultant>
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

    const [newAppointment, setNewAppointment] = useState({
        patient: '',
        start: null,
        end: null,
        appointmentReason: '',
    });

    const closeModal = () => {
        setManualModalIsOpen(false);
        setNewAppointment({
            patient: '',
            start: null,
            end: null,
            appointmentReason: '',
        });
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const openManualModal = () => {
        setNewAppointment({
            patient: '',
            start: null,
            end:null,
            appointmentReason: '',
        });
        setManualModalIsOpen(true);
    };


    const handleDateChange = (newDate, field) => {
        if (newDate) {
            // Formatăm data la 'DD/MM/YYYY HH:mm' și actualizăm starea
            const formattedDate = moment(newDate).format('MM/DD/YYYY HH:mm');
            setNewAppointment((prev) => ({ ...prev, [field]: formattedDate }));
        }
    };

    const fetchPatients = async () =>{
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/api/admin/patient/get-patients', {
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

    const addNewAppointment = async () => {

        try {
            const token = localStorage.getItem('token');
            const formattedStart = moment(newAppointment.start).format('DD/MM/YYYY HH:mm');
            const formattedEnd = moment(newAppointment.end).format('DD/MM/YYYY HH:mm');
            const response = await axios.post(
                "http://localhost:8080/api/admin/appointment/make-appointment",
                {
                    appointmentReason: appointmentReason,
                    patientCnp: selectedPatientCNP,
                    date: formattedStart,
                    hour: formattedEnd
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                    },
                }
            );

            if (response.status === 200) {
                console.log(
                    "Programare salvata cu succes",
                    response.data
                );

            } else {
                alert("Eroare la salvarea programarii: " + response.statusText);
            }
        } catch (error) {
            console.error(
                "Eroare de la server:",
                error.response ? error.response.data : error.message
            );
            alert(
                "Eroare la salvarea programarii: " +
                (error.response ? error.response.data.message : error.message)
            );
        }
        closeModal();
    };

    useEffect(() => {
        fetchPatients();
    }, []);


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
                <a href="/" className={stylesVertical["logo"]}>
                    <img className={stylesVertical["logo"]} src={logo} alt="DENTHELP"/>
                    <p className={stylesVertical["logo-name"]}>DENT<br/>HELP</p>
                </a>
                <ul className={stylesVertical.menuItems}>
                    <li className={stylesVertical.menuItem}>
                        <img src={cab_activity} className={stylesVertical.verticalIcon}/>
                        <a onClick={() => handleLinkClick('cab-activity')}
                           className={stylesVertical.category}>Activitatea cabinetului</a>
                    </li>
                    <li>
                        <div className={stylesVertical.menuItem}>
                            <img src={appointment} className={stylesVertical.verticalIcon}/>
                            <a onClick={() => toggleSubmenu('appointments')} className={stylesVertical.category}>
                                Programări
                            </a>
                        </div>
                        {isSubmenuOpen.appointments && (
                            <ul className={stylesVertical.submenu}>
                                <li>
                                    <a onClick={() => handleLinkClick('appointments')}>Calendar programări</a>
                                </li>
                                <li>
                                    <a onClick={() => handleLinkClick('request')}>Solicitări programări</a>
                                </li>
                                <li>
                                    <a onClick={() => handleLinkClick('addAppointment')}>Adaugați programare</a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className={stylesVertical.menuItem}>
                        <img src={patients_photo} className={stylesVertical.verticalIcon}/>
                        <a onClick={() => handleLinkClick('patients')}
                           className={stylesVertical.category}>Pacienți</a>
                    </li>
                    <li className={stylesVertical.menuItem}>
                        <img src={notification_photo} className={stylesVertical.verticalIcon}/>
                        <a onClick={() => handleLinkClick('notifications')}
                           className={stylesVertical.category}>Notificări</a>
                    </li>
                    <li className={stylesVertical.menuItem}>
                        <img src={resume} className={stylesVertical.verticalIcon}/>
                        <a onClick={() => handleLinkClick('register_people')}
                           className={stylesVertical.category}>Înregistrează utilizatori</a>
                    </li>
                    <li className={stylesVertical.menuItem}>
                        <img src={medicine} className={stylesVertical.verticalIcon}/>
                        <a onClick={() => handleLinkClick('consultant')}
                           className={stylesVertical.category}>Consultant</a>
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
                            <button onClick={() => handleLogout()} className={stylesVertical["footerMenuButtons"]}>Deconectare</button>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className={pageStyle.rightSide}>
                <NavBar></NavBar>
                {activeComponent}
            </div>

            <Modal open={manualModalIsOpen} onClose={closeModal} aria-labelledby="manual-appointment-modal-title">
                <Box className={styles.modal}>
                    <h2 id="manual-appointment-modal-title" className={styles.addNewAppT}>
                        Adaugă Programare</h2>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="Data și ora de început"
                            value={newAppointment.start ? moment(newAppointment.start, 'DD/MM/YYYY HH:mm') : null}
                            onChange={(date) => handleDateChange(date, 'start')}
                            renderInput={(props) => <TextField {...props} fullWidth margin="normal"/>}
                        />
                        <DateTimePicker
                            label="Data și ora de sfârșit"
                            value={newAppointment.end ? moment(newAppointment.end, 'DD/MM/YYYY HH:mm') : null}
                            onChange={(date) => handleDateChange(date, 'end')}
                            renderInput={(props) => <TextField {...props} fullWidth margin="normal"/>}
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="patient-select-label">Pacient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            value={selectedPatientCNP}
                            onChange={(e) => {
                                setSelectedPatientCNP(e.target.value);
                                setNewAppointment({...newAppointment, patient: e.target.value});
                            }}
                        >
                            {patients.map((patient) => (
                                <MenuItem key={patient.patientCnp} value={patient.patientCnp}>
                                    {`${patient.patientFirstName} ${patient.patientSecondName} (${patient.patientCnp})`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className={styles["appointmentReason"]}>
                        <label className={styles["appointment-reason-label"]} htmlFor="appointment-reason-inupt">Selectati
                            motivul programării</label>
                        <select
                            className={styles["appointment-reason-input"]}
                            id="appointment-reason-select"
                            required
                            value={appointmentReason}
                            onChange={(e) => setAppointmentReason(e.target.value)}
                        >
                            <option value="" disabled>
                                Selectați motivul programării
                            </option>
                            <option value="consult">Consult</option>
                            <option value="igienizare">Igienizare Profesionala</option>
                            <option value="albire">Albire Profesionala</option>
                            <option value="durere-masea">Durere măsea</option>
                            <option value="control">Control</option>
                        </select>
                    </div>
                    <button
                        className={styles.addBtn}
                        onClick={addNewAppointment}
                    >Adaugă Programare
                    </button>
                </Box>
            </Modal>

        </div>
    );
};

export default GeneralPatientBoard;
