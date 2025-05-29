import Scheduler from "./Scheduler.jsx";
import ConfirmAppointments from "./ConfirmAppointments.jsx";
import {useEffect, useState} from "react";
import styles from '../assets/css/SchedulareAppointmentsPageAdmin.module.css'
import NavBar from "./NavBar.jsx";
import {Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment/moment.js";
import axios from "axios";
import NotificationsAdmin from "./NotificationsAdmin.jsx";

function SchedulareAppointmentsPageAdmin() {
    const [activeComponent, setActiveComponent] = useState('scheduler');
    const [manualModalIsOpen, setManualModalIsOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatientCNP, setSelectedPatientCNP] = useState(''); // State for selected patient CNP
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const handleComponentChange = (component) => {
        setActiveComponent(component);
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
        handleComponentChange('addApp')
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

    const addNewAppointment = async () => {

        try {
            const token = localStorage.getItem('token');
            const formattedStart = moment(newAppointment.start).format('DD/MM/YYYY HH:mm');
            const formattedEnd = moment(newAppointment.end).format('DD/MM/YYYY HH:mm');
            const response = await axios.post(
                baseUrl+"/api/admin/appointment/make-appointment",
                {
                    appointmentReason: newAppointment.appointmentReason,
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

    return (
        <div className={styles["page"]}>
            <NavBar></NavBar>
            <div className={styles["content"]}>
                <div className={styles['slidebar']}>
                    <button
                        className={styles[activeComponent === 'scheduler' ? "slidebar-buttons-active" : "slidebar-buttons"]}
                        onClick={() => handleComponentChange('scheduler')}
                    >
                        Scheduler
                    </button>

                    <button
                        className={styles[activeComponent === 'confirmations' ? "slidebar-buttons-active" : "slidebar-buttons"]}
                        onClick={() => handleComponentChange('confirmations')}
                    >
                        Solicitari Programări
                    </button>
                    <button
                        className={styles[activeComponent === 'addApp' ? "slidebar-buttons-active" : "slidebar-buttons"]}
                        onClick={openManualModal}
                    >
                        Adaugă Programare
                    </button>

                    <button
                        className={styles[activeComponent === 'notifications' ? "slidebar-buttons-active" : "slidebar-buttons"]}
                        onClick={() => handleComponentChange('notifications')}
                    >
                        Notificări
                    </button>
                </div>

                {/* Conținutul schimbabil */}
                <div style={{flexGrow: 1, padding: '20px'}}>
                    {activeComponent === 'scheduler' && <Scheduler/>}
                    {activeComponent === 'confirmations' && <ConfirmAppointments/>}
                    {activeComponent === 'notifications' && <NotificationsAdmin/>}
                </div>
            </div>

            <Modal open={manualModalIsOpen} onClose={closeModal} aria-labelledby="manual-appointment-modal-title">
                <Box sx={modalStyle}>
                    <Typography id="manual-appointment-modal-title" variant="h6" component="h2">
                        Adaugă Programare
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="Data și ora de început"
                            value={newAppointment.start ? moment(newAppointment.start, 'DD/MM/YYYY HH:mm') : null}
                            onChange={(date) => handleDateChange(date, 'start')}
                            renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
                        />
                        <DateTimePicker
                            label="Data și ora de sfârșit"
                            value={newAppointment.end ? moment(newAppointment.end, 'DD/MM/YYYY HH:mm') : null}
                            onChange={(date) => handleDateChange(date, 'end')}
                            renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>

                    {/* The Select component for patient selection */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="patient-select-label">Pacient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            value={selectedPatientCNP}
                            onChange={(e) => {
                                setSelectedPatientCNP(e.target.value);
                                setNewAppointment({ ...newAppointment, patient: e.target.value });
                            }}
                        >
                            {patients.map((patient) => (
                                <MenuItem key={patient.patientCnp} value={patient.patientCnp}>
                                    {`${patient.patientFirstName} ${patient.patientSecondName} (${patient.patientCnp})`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Motiv"
                        value={newAppointment.reason}
                        onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addNewAppointment}
                        sx={{ mt: 2 }}
                    >
                        Adaugă Programare
                    </Button>
                </Box>
            </Modal>

        </div>
    );
}

export default SchedulareAppointmentsPageAdmin;
