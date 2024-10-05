import { useState } from 'react';
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
import NavBar from "./NavBar.jsx";

const StyledStaticDatePicker = styled(StaticDatePicker)({
    '.MuiDateCalendar-root': {
        color: '#3fcfe7',
        borderWidth: '2px',
        borderColor: '#3fcfe7',
        border: '2px solid',
        backgroundColor: '#ffffff',
    },
});

function RequestAppointment() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [preferredTime, setPrefferedTime] = useState('');
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
            // Dacă timpul și data sunt valide, adăugăm intervalul
            const newTimeSlot = { date: selectedDate.format('DD/MM/YYYY'), time: preferredTime };
            setTimeSlots([...timeSlots, newTimeSlot]);
            setPrefferedTime('');
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

                const response = await axios.post(
                    "http://localhost:8080/api/in/appointment_request",
                    {
                        appointmentReason:appointmentReason,
                        cnp: cnp,
                        desiredAppointmentTime:formattedTimeSlots
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                        },
                    }
                );

                if (response.status === 200) {
                    alert(`Cerere programare trimisă: ${formattedTimeSlots}`);
                    navigator('/PatientMainPage')
                    console.log(
                        "Cerere programare trimisa cu succes",
                        response.data
                    );
                } else {
                    alert("Eroare la trimiterea cererii anamnezei: " + response.statusText);
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
            <NavBar></NavBar>
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
                        <img
                            className={styles["appointmentBigImage"]}
                            src={requestAppointmentImage}
                            alt="appointment image"
                        />
                    </div>
                </div>
                <div className={styles["text-part"]}>
                    <div className={styles['form-group']}>
                        <p>Data selectată: {selectedDate.format('DD/MM/YYYY')}</p>
                        <label htmlFor="hours-input">Specificați orele la care ați fi disponibil în ziua
                            respectivă:</label>
                        <input
                            type="text"
                            placeholder="scrieți orele disponibile"
                            required
                            id="hours-input"
                            value={preferredTime}
                            onChange={(e) => setPrefferedTime(e.target.value)}
                        />
                        <button className={styles["add-timeslot-button"]} onClick={handleAddNewTimeSlot}>Adaugă</button>
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
                                    <button className={styles["edit-delete-button"]} onClick={() => handleEditTimeSlot(index)}>Editează</button>
                                    <button className={styles["edit-delete-button"]} onClick={() => handleDeleteTimeSlot(index)}>Șterge</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="appointmentReason">
                        <label className={styles["appointment-reason-label"]} htmlFor="appointment-reason-inupt">Scrieți motivul programării</label>
                        <input
                            className={styles["appointment-reason-input"]}
                            type="text"
                            id="appointment-reason-inupt"
                            required
                            value={appointmentReason}
                            onChange={(e) => setAppointmentReason(e.target.value)}
                            placeholder="ex: consult/carie/durere măsea"
                        />
                    </div>
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
                {/* Modal pentru editare interval orar */}
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box sx={{...modalStyle}}>
                        <h2>Editează intervalul orar</h2>
                        <TextField
                            label="Interval orar"
                            value={editingTime}
                            onChange={(e) => setEditingTime(e.target.value)}
                            fullWidth
                        />
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
