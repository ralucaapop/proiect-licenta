import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material';
import dayjs from 'dayjs';
import { Modal, Box, Button, TextField, Alert } from '@mui/material';
import styles from "../assets/css/RequestAppointment.module.css";
import {parseJwt} from "../service/authService.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import requestAppointmentImage from "../assets/request_appointment_photo/request_appointment.png";
import requestAppIntro from "../assets/request_appointment_photo/onlineAppointment.png"
import NavBar from "./NavBar.jsx";

const StyledStaticDatePicker = styled(StaticDatePicker)({
    '.MuiDateCalendar-root': {
        color: '#3fcfe7',
        borderColor: '#3fcfe7',
        border: '2px solid',
        backgroundColor: '#ffffff',

},
});

function RequestAppointment() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [preferredTime, setPreferredTime] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingTime, setEditingTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [timeError, setTimeError] = useState('');
    const [appointmentError, setAppointmentError] = useState('');
    const [appointmentReasonMissingError, setAppointmentReasonMissingError] = useState('');
    const [appointmentReason, setAppointmentReason] = useState('');
    const navigator = useNavigate();
    const today = dayjs();
    const maxDate = today.add(1, 'month');

    const handleAddNewTimeSlot = () => {
        // Verificăm dacă data selectată există deja în lista de intervale orare
        const isDateAlreadySelected = timeSlots.some(slot => slot.date === selectedDate.format('DD/MM/YYYY'));

        if (isDateAlreadySelected) {
            setErrorMessage('Această dată a fost deja selectată. Alegeți o altă dată.');
            setTimeError(''); // Resetăm mesajul de eroare pentru timp
        }else if (!preferredTime) {
            setTimeError('Trebuie să specificați un interval orar.');
        }
        else {
            const newTimeSlot = { date: selectedDate.format('DD/MM/YYYY'), time: preferredTime };
            setTimeSlots([...timeSlots, newTimeSlot]);
            setPreferredTime('');
            setErrorMessage(''); // Resetăm mesajul de eroare pentru dată
            setTimeError(''); // Resetăm mesajul de eroare pentru timp
        }
    };

    const handleEditTimeSlot = (index) => {
        const timeSlotToEdit = timeSlots[index];
        setEditingTime(timeSlotToEdit.time);
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingTime) {
            const updatedTimeSlots = [...timeSlots];
            updatedTimeSlots[editingIndex] = { ...updatedTimeSlots[editingIndex], time: editingTime };
            setTimeSlots(updatedTimeSlots);
            setIsModalOpen(false);
        }
    };




    const handleDeleteTimeSlot = (index) => {
        const updatedTimeSlots = timeSlots.filter((_, i) => i !== index);
        setTimeSlots(updatedTimeSlots);
    };
    const shouldDisableDate = (date) => {
        const day = date.day();
        return day === 0; // 0 pentru duminică, 6 pentru sâmbătă
    };

    const handleSendRequest = async () =>{
        if(timeSlots.length === 0)
            setAppointmentError("Trebuie sa selectati cel putin o data");
        else if(!appointmentReason)
        {
            setAppointmentReasonMissingError("Trebuie sa specificati motivul programarii");
        }
        else{
            setAppointmentReasonMissingError("");
            setAppointmentError("");
            const formattedTimeSlots = timeSlots
                .map(slot => `${slot.date} - ${slot.time}`)  // Convertim fiecare obiect într-un string
                .join(', ');  // Îmbinăm toate într-un singur string, separate prin virgul

            try {
                const token = localStorage.getItem('token');
                const decodedToken = parseJwt(token); // Funcția parseJwt pentru a decoda token-ul
                const cnp = decodedToken.cnp;

                const now = new Date();
                const day = String(now.getDate()).padStart(2, "0");
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, "0");
                const minutes = String(now.getMinutes()).padStart(2, "0");
                const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;

                const response = await axios.post(
                    "http://localhost:8080/api/in/appointment_request/add_appointment_request",
                    {
                        appointmentReason:appointmentReason,
                        cnp: cnp,
                        desiredAppointmentTime:formattedTimeSlots,
                        requestDate:formattedDateTime
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                        },
                    }
                );

                if (response.status === 200) {
                    alert(`Cerere programare trimisă: ${formattedTimeSlots}`);
                    navigator('/GeneralPatientBoard/history')
                    console.log(
                        "Cerere programare trimisa cu succes",
                        response.data
                    );
                } else {
                    alert("Eroare la trimiterea solicitarii: " + response.statusText);
                }
            } catch (error) {
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message
                );
                alert(
                    "Eroare la salvarea inregistrarii: " +
                    (error.response ? error.response.data.message : error.message)
                );
            }
        }
    }

    return (

        <div className={styles["page"]}>
            <div className={styles["introduction"]}>
                <img className={styles["intro-photo"]} src={requestAppIntro}></img>
                <p className={styles["intro-paragraph"]}>
                    Rezervă-ți consultația stomatologică online și scapă de grija telefoanelor sau a cozii la recepție.
                    Platforma noastră îți permite să îți gestionezi programările rapid și eficient,
                    oferindu-ți controlul complet asupra timpului tău. Încearcă și tu avantajul programării online!
                </p>
            </div>

            <div className={styles["content"]}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className={styles["calendar-page"]}>
                        <div className={styles["calendar-part"]}>
                            <h3 className={styles["title"]}>Selectați data în care doriți o programare</h3>
                            <StyledStaticDatePicker
                                value={selectedDate}
                                onChange={(newDate) => setSelectedDate(newDate)}
                                minDate={today}
                                maxDate={maxDate}
                                displayStaticWrapperAs="desktop"
                                shouldDisableDate={shouldDisableDate}
                            />
                        </div>
                    </div>
                    <div className={styles["text-part"]}>
                        <div className={styles['form-group']}>
                            <p>Data selectată: {selectedDate.format('DD/MM/YYYY')}</p>
                            <label htmlFor="hours-input">Specificați intervalul/intervalele în care ați fi disponibil în ziua
                                respectivă:</label>
                            <div className={styles["hours-input"]} id="hours-input">
                                {["08:00 - 11:00", "13:00 - 16:00", "17:00 - 20:00"].map((hour) => (
                                    <label key={hour}>
                                        <input
                                            type="checkbox"
                                            value={hour}
                                            checked={preferredTime.includes(hour)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPreferredTime([...preferredTime, hour]);
                                                } else {
                                                    setPreferredTime(preferredTime.filter((time) => time !== hour));
                                                }
                                            }}
                                        />
                                        {hour}
                                    </label>
                                ))}
                            </div>

                            <button className={styles["add-timeslot-button"]} onClick={handleAddNewTimeSlot}>Adaugă
                            </button>
                        </div>

                        {/* Afișăm mesajele de eroare */}
                        {errorMessage && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {errorMessage}
                            </Alert>
                        )}
                        {timeError && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {timeError}
                            </Alert>
                        )}

                        <div className={styles['time-slots']}>
                            <h4 className={styles["time-slots-title"]}>Intervale selectate:</h4>
                            <ul>
                                {timeSlots.map((slot, index) => (
                                    <li key={index}>
                                        <span>{slot.date} - {slot.time}</span>
                                        <button className={styles["edit-delete-button"]}
                                                onClick={() => handleEditTimeSlot(index)}>Editează
                                        </button>
                                        <button className={styles["edit-delete-button"]}
                                                onClick={() => handleDeleteTimeSlot(index)}>Șterge
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles["appointmentReason"]}>
                            <label className={styles["appointment-reason-label"]} htmlFor="appointment-reason-inupt">Scrieți
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
                            {appointmentReasonMissingError && (
                                <Alert severity="error" sx={{mt: 2}}>
                                    {appointmentReasonMissingError}
                                </Alert>
                            )}
                            <button onClick={handleSendRequest}>Trimite Cererea</button>
                            {appointmentError && (
                                <Alert severity="error" sx={{mt: 2}}>
                                    {appointmentError}
                                </Alert>
                            )}
                        </div>


                    </div>
                    {/* Modal pentru editare interval orar */}
                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Box sx={modalStyle}>
                            <h2>Editează intervalul orar</h2>
                            <div className={styles["hours-input"]} id="hours-input">
                                {["08:00 - 11:00", "13:00 - 16:00", "17:00 - 20:00"].map((hourE) => (
                                    <label key={hourE}>
                                        <input
                                            type="checkbox"
                                            value={hourE}
                                            checked={editingTime.includes(hourE)}  // Verifică dacă `editingTime` include acest interval
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setEditingTime([...editingTime, hourE]);  // Adaugă la `editingTime` dacă checkbox-ul este bifat
                                                } else {
                                                    setEditingTime(editingTime.filter((time1) => time1 !== hourE));  // Elimină din `editingTime` dacă debifezi
                                                }
                                            }}
                                        />
                                        {hourE}
                                    </label>
                                ))}
                            </div>

                            <Button variant="contained" onClick={handleSaveEdit} sx={{mt: 2}}>
                                Salvează
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setIsModalOpen(false)}
                                sx={{mt: 2, ml: 2}}
                            >
                                Renunță
                            </Button>
                        </Box>
                    </Modal>

                </LocalizationProvider>
            </div>
        </div>
    );
}

// Stil pentru modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

export default RequestAppointment;
