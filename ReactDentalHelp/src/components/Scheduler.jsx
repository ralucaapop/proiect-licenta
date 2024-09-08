import {useEffect, useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {Modal, Box, Typography, Button, TextField, FormControl, Select, InputLabel, MenuItem} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from "axios";
import {useNavigate} from "react-router-dom";


// Setarea localizării Moment.js la ora României
moment.locale('ro');
const localizer = momentLocalizer(moment);

const Scheduler = () => {
    const navigator = useNavigate()
    const [events, setEvents] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatientCNP, setSelectedPatientCNP] = useState(''); // State for selected patient CNP

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
                console.error('Datele primite nu sunt un array:', data);
            }
        } catch (error) {
            console.error('Eroare la preluarea evenimentelor:', error);
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
                    patient: event.patient,
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

    // Stare pentru modaluri
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

    // Funcția pentru a șterge programarea selectată
    const deleteAppointment = async ()  => {
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



    // Stiluri pentru conținutul modalului
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

    // Setarea intervalului de ore vizibile (7:00 - 22:00)
    const minTime = new Date();
    minTime.setHours(7, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(22, 0, 0);

    // Definirea formatului pentru ore în calendar
    const formats = {
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
        agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
    };

    return (
        <div>
            <h2>Programările Pacienților</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={openManualModal}
                sx={{ mb: 2 }}
            >
                Adaugă Programare Manual (Medici)
            </Button>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={['week', 'day']}
                defaultView="week"
                min={minTime}
                max={maxTime}
                formats={formats}
                selectable={true}
                onSelectSlot={openModalForNew}
                onSelectEvent={openModalForEdit}
            />

            <Modal open={modalIsOpen} onClose={closeModal} aria-labelledby="appointment-modal-title">
                <Box sx={modalStyle}>
                    <Typography id="appointment-modal-title" variant="h6" component="h2">
                        {isAddingAppointment ? 'Adaugă o nouă programare' : 'Detalii programare'}
                    </Typography>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="patient-select-label">Pacient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            value={selectedPatientCNP} // use state for selected patient CNP
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
                    </FormControl>

                    <Typography>
                        Început: {moment(newAppointment.start).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                    <Typography>
                        Sfârșit: {moment(newAppointment.end).format('DD/MM/YYYY HH:mm')}
                    </Typography>

                    {isAddingAppointment ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addNewAppointment}
                            sx={{ mt: 2 }}
                        >
                            Adaugă Programare
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={deleteAppointment}
                                sx={{ mt: 2 }}
                            >
                                Șterge Programare
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={closeModal}
                                sx={{ mt: 2, ml: 2 }}
                            >
                                Închide
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal open={manualModalIsOpen} onClose={closeModal} aria-labelledby="manual-appointment-modal-title">
                <Box sx={modalStyle}>
                    <Typography id="manual-appointment-modal-title" variant="h6" component="h2">
                        Adaugă Programare Manual (Medici)
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
};

export default Scheduler;