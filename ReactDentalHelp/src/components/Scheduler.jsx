import React, {useEffect, useState} from 'react';
import {Calendar, dateFnsLocalizer, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import styles from "../assets/css/Scheduler.module.css"
import 'moment/locale/ro';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ro from 'date-fns/locale/ro';

const locales = {
    ro: ro,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});


const Scheduler = () => {
    const navigate = useNavigate()
    const [events, setEvents] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatientCNP, setSelectedPatientCNP] = useState('');
    const [appointmentReason, setAppointmentReason] = useState(null);
    const [patientName, setPatientName] = useState("");
    const [cnpPatientForRedirection, setCnpPatientForRedirection] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isAddingAppointment, setIsAddingAppointment] = useState(false);
    const [manualModalIsOpen, setManualModalIsOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patient: '',
        start: null,
        end: null,
        appointmentReason: '',
    });

    const [selectedEventId, setSelectedEventId] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(false);

    // Funcția pentru a prelua datele de la API
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

    const fetchPatientNameByCnp = async (patientCnp) => {
        try {
            const token = localStorage.getItem("token")
            console.log(patientCnp);
            const response = await axios.get(
                `http://localhost:8080/api/admin/patient/get-patient-persoanl-data/${patientCnp}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data.data;
                const complete_name = data.firstName + " " + data.lastName;
                return complete_name; // Returnează numele pacientului
            }
        } catch (error) {
            console.error("Eroare la extragerea pacientului:", error);
        }
    };

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get('http://localhost:8080/api/admin/appointment/get-appointments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data.data;
            if (Array.isArray(data)) {
                const apiEvents = data.map((event) => ({
                    id: event.appointmentId,
                    appointmentReason: event.appointmentReason,
                    // Folosim moment.js pentru a converti string-urile în obiecte de tip Date
                    start: moment(event.date, 'DD/MM/YYYY HH:mm').toDate(),
                    end: moment(event.hour, 'DD/MM/YYYY HH:mm').toDate(),
                    patient: event.patientCnp,
                }));

                setEvents(apiEvents); // Setează evenimentele preluate în starea `events`
            } else {
                console.error('Datele primite nu sunt un array:', data);
            }
        } catch (error) {
            console.error('Eroare la preluarea evenimentelor:', error);
        }
    };


    useEffect(() => {
        fetchEvents();
        fetchPatients();
    }, []);


    // Funcția pentru a deschide modalul la selectarea unei programări
    const openModalForEdit = (event) => {
        setNewAppointment({
            patient: event.patient,
            start: event.start,
            end: event.end,
            appointmentReason:event.appointmentReason
        });
        setSelectedEventId(event.id);
        setModalIsOpen(true);
        setIsAddingAppointment(false);
    };

    // Funcția pentru a deschide modalul pentru adăugarea unei programări
    const openModalForNew = ({ start, end }) => {
        setNewAppointment({
            patient: '',
            appointmentReason: '',
            start,
            end,
        });
        setSelectedEventId(null);
        setModalIsOpen(true);
        setIsAddingAppointment(true);
    };

    // Funcția pentru a închide modalul
    const closeModal = () => {
        setModalIsOpen(false);
        setManualModalIsOpen(false);
        setNewAppointment({
            patient: '',
            start: null,
            end: null,
            appointmentReason: '',
        });
    };

    // Funcția pentru a adăuga o nouă programare
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
                    hour: formattedEnd,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                    },
                }
            );

            if (response.status === 200) {
                await fetchEvents();
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

    const confirmDeleteAppointment =()=>{
        setConfirmationModal(true);
    }

    const closeConfirmModal =()=>{
        setConfirmationModal(false);
    }

    // Funcția pentru a șterge programarea selectată
    const deleteAppointment = async ()  => {
        closeConfirmModal();
        if (selectedEventId) {
            try{
                closeModal();
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `http://localhost:8080/api/admin/appointment/delete-appointment/${selectedEventId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    await fetchEvents();
                    console.log(
                        "Programare stearsa cu succes",
                        response.data
                    );
                } else {
                    alert("Eroare la stergerea programarii: " + response.statusText);
                }
            }
            catch (error) {
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message
                );
                alert(
                    "Eroare la stergerea programarii: " +
                    (error.response ? error.response.data.message : error.message)
                );
            }
        }
    };

    // Funcția pentru a deschide modalul în care medicul poate adăuga programare manual
    const openManualModal = () => {
        setNewAppointment({
            patient: '',
            start: null,
            end:null,
            appointmentReason: '',
        });
        setManualModalIsOpen(true);
        setIsAddingAppointment(true);
    };

    // Funcția pentru a seta data și ora programării manual
    const handleDateChange = (newDate, field) => {
        if (newDate) {
            // Formatăm data la 'DD/MM/YYYY HH:mm' și actualizăm starea
            const formattedDate = moment(newDate).format('MM/DD/YYYY HH:mm');
            setNewAppointment((prev) => ({ ...prev, [field]: formattedDate }));
        }
    };




    // Setarea intervalului de ore vizibile (7:00 - 22:00)
    const minTime = new Date();
    minTime.setHours(7, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(23, 0, 0);

    // Definirea formatului pentru ore în calendar
    const formats = {
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
        agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
    };

    const handlePatientDetailsRedirect = (patientCnp) => {
        navigate(`/GeneralAdminBoard/specific-patient`, { state: { patientCnp } });
    };

    const getPatientName =async () =>{
        const appointment = events.find(event => event.id === selectedEventId);
        if (appointment) {
            const patientCnp = appointment.patient;
            setCnpPatientForRedirection(patientCnp)
            try {
                const name = await fetchPatientNameByCnp(patientCnp); // Wait for the promise to resolve
                return name; // Return the resolved name
            } catch (error) {
                console.error('Failed to fetch patient name:', error);
                return '';
            }
        }
        return '';
    };

    useEffect(() => {
        if (modalIsOpen && selectedEventId && !isAddingAppointment) {
            const loadPatientName = async () => {
                const name = await getPatientName();
                setPatientName(name); // Update the state with the fetched name
            };
            loadPatientName(); // Call the async function
        }
    }, [modalIsOpen, selectedEventId]);




    return (
        <div>
            <h2 className={styles["patients-appointment-title"]}>Programările Pacienților</h2>

            <Calendar
                localizer={localizer}
                events={events}
                culture="ro"
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, backgroundColor: "white", padding: "10px" }}
                messages={{
                    next: "Înainte",
                    previous: "Înapoi",
                    today: "Azi",
                    month: "Luna",
                    week: "Săptămână",
                    day: "Zi",
                    May: "mai"
                }}
                views={['week', 'day']}
                defaultView="week"
                min={minTime}
                max={maxTime}
                formats={formats}
                selectable={true}
                onSelectSlot={openModalForNew}
                onSelectEvent={openModalForEdit}
            />

            <Modal open={confirmationModal} onClose={closeConfirmModal}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>Anulează programarea</h2>
                    <p className={styles.text}>
                        Ești sigur că dorești să anulezi acestă programare?
                    </p>
                    <button className={styles.actionButton} onClick={()=>deleteAppointment()}>
                        Da, anulează programare
                    </button>
                    <button onClick={closeConfirmModal}>Renunță</button>
                </Box>
            </Modal>

            <Modal open={modalIsOpen} onClose={closeModal} aria-labelledby="appointment-modal-title">
                <Box className={styles.modal}>
                    <h2 className={styles.addNewAppT}>
                        {isAddingAppointment ? 'Adaugă o nouă programare' : 'Detalii programare'}
                    </h2>
                    <FormControl fullWidth margin="normal">
                        {isAddingAppointment ?(
                            <>
                            <InputLabel id="patient-select-label">Pacient</InputLabel>
                            <Select
                                labelId="patient-select-label"
                                value={selectedPatientCNP}
                                onChange={(e) => {
                                    setSelectedPatientCNP(e.target.value);
                                    setNewAppointment({ ...newAppointment, patient: e.target.value });
                                }}
                                disabled={!isAddingAppointment}
                            >
                                {patients.map((patient) => (
                                    <MenuItem key={patient.patientCnp} value={patient.patientCnp}>
                                        {`${patient.patientFirstName} ${patient.patientSecondName}(${patient.patientCnp})`}
                                    </MenuItem>
                                ))}
                            </Select>
                                <div className={styles["appointmentReason"]}>
                                    <p className={styles["appointment-reason-label"]} htmlFor="appointment-reason-inupt">Selectati
                                        motivul programării</p>
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
                                        <option value="control">Control</option>
                                        <option value="extractie-dentara">Extragere dentară</option>
                                        <option value="implant-dentar">Implant dentar</option>
                                        <option value="proteza-dentara">Proteza dentară</option>
                                        <option value="fatete-dentare">Fațete dentare</option>
                                        <option value="coroana-dentara">Coroană dentară</option>
                                        <option value="aparat-dentar">Aparat dentar</option>
                                        <option value="tratament-carii">Tratament carii</option>
                                        <option value="tratament-parodontoza">Tratament parodontoză</option>
                                        <option value="gutiera-bruxism">Gutiere pentru bruxism</option>
                                    </select>
                                </div>
                            </>
                        ) : (<div className={styles.patientName}>
                            <p>Pacient:</p>
                            <button className={styles.patientNameB}
                                    onClick={() => handlePatientDetailsRedirect(cnpPatientForRedirection)}
                            >
                                {patientName}
                            </button>
                        </div>)}
                    </FormControl>

                    <p>
                        Început: {moment(newAppointment.start).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <p>
                        Sfârșit: {moment(newAppointment.end).format('DD/MM/YYYY HH:mm')}
                    </p>

                    {isAddingAppointment ? (
                        <button
                            onClick={addNewAppointment}
                            className={styles.addBtn}
                        >
                            Adaugă Programare
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={confirmDeleteAppointment}
                                className={styles.cancelAppointment}
                            >
                                Anuleaza Programare
                            </button>
                            <button
                                onClick={closeModal}
                                className={styles.closeModal}

                            >
                                Închide
                            </button>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal open={manualModalIsOpen} onClose={closeModal} aria-labelledby="manual-appointment-modal-title">
                <Box className={styles.modal}>
                    <h2 className={styles.addNewAppT}>
                        Adaugă Programare
                    </h2>
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
                            <option value="Consult">Consult</option>
                            <option value="Igienizare profesionala">Igienizare Profesionala</option>
                            <option value="Albire profesionala">Albire Profesionala</option>
                            <option value="Control">Control</option>
                            <option value="Extractie dentara">Extragere dentară</option>
                            <option value="Implant dentar">Implant dentar</option>
                            <option value="Proteza dentara">Proteza dentară</option>
                            <option value="Fatete dentare">Fațete dentare</option>
                            <option value="Coroana dentara">Coroană dentară</option>
                            <option value="Aparat dentar">Aparat dentar</option>
                            <option value="Tratament carii">Tratament carii</option>
                            <option value="Tratament parodontoză">Tratament parodontoză</option>
                            <option value="Gutiere pentru bruxism">Gutiere pentru bruxism</option>
                            <option value="Tratament de canal (endodonție)">Tratament de canal (endodonție)</option>
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

export default Scheduler;