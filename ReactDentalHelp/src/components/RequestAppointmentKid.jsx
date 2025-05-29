import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { styled } from '@mui/material';
import dayjs from 'dayjs';
import { Modal, Box, Button, TextField, Alert } from '@mui/material';
import styles from "../assets/css/RequestAppointmentKid.module.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import edit from "../assets/icons/edit.png";
import deleteI from "../assets/icons/delete.png"


const StyledStaticDatePicker = styled(StaticDatePicker)({
    '.MuiDateCalendar-root': {
        color: '#3fcfe7',
        borderWidth: '2px',
        borderColor: '#3fcfe7',
        border: '2px solid',
        backgroundColor: '#ffffff',
        width:"280px",
        height: "300px"
    },
});

function RequestAppointmentKid({ cnpProp }) {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [preferredTime, setPreferedTime] = useState('');
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
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const handleAddNewTimeSlot = () => {
        const isDateAlreadySelected = timeSlots.some(slot => slot.date === selectedDate.format('DD/MM/YYYY'));

        if (isDateAlreadySelected) {
            setErrorMessage('Această dată a fost deja selectată. Alegeți o altă dată.');
            setTimeError('');
        } else if (!preferredTime) {
            setTimeError('Trebuie să specificați un interval orar.');
        } else {
            const newTimeSlot = { date: selectedDate.format('DD/MM/YYYY'), time: preferredTime };
            setTimeSlots([...timeSlots, newTimeSlot]);
            setPrefferedTime('');
            setErrorMessage('');
            setTimeError('');
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
        return day === 0;
    };

    const handleSendRequest = async () => {
        if (timeSlots.length === 0) {
            setAppointmentError("Trebuie să selectați cel puțin o dată.");
        } else if (!appointmentReason) {
            setAppointmentReasonMissingError("Trebuie să specificați motivul programării.");
        } else {
            setAppointmentReasonMissingError("");
            setAppointmentError("");
            const formattedTimeSlots = timeSlots
                .map(slot => `${slot.date} - ${slot.time}`)
                .join(', ');

            try {
                const token = localStorage.getItem('token');
                console.log(cnpProp)
                const response = await axios.post(
                    baseUrl+"/api/in/appointment_request",
                    {
                        appointmentReason: appointmentReason,
                        cnp: cnpProp,
                        desiredAppointmentTime: formattedTimeSlots
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    alert(`Cerere programare trimisă: ${formattedTimeSlots}`);
                    navigator('/PatientMainPage');
                } else {
                    alert("Eroare la trimiterea cererii: " + response.statusText);
                }
            } catch (error) {
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message
                );
                alert(
                    "Eroare la salvarea înregistrării: " +
                    (error.response ? error.response.data.message : error.message)
                );
            }
        }
    };

    return (
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
                    <div className={styles.text_part}>
                        <div className={styles['form-group']}>
                            <p className={styles.date}>Data selectată: {selectedDate.format('DD/MM/YYYY')}</p>
                            <p htmlFor="hours-input">Specificați intervalul/intervalele în care ați fi disponibil în
                                ziua
                                respectivă:</p>
                            <div className={styles["hours-input"]} id="hours-input">
                                {["08:00 - 11:00", "13:00 - 16:00", "17:00 - 20:00"].map((hour) => (
                                    <label key={hour} className={styles.labelHour}>
                                        <input
                                            type="checkbox"
                                            value={hour}
                                            className={styles.checkBox}
                                            checked={preferredTime.includes(hour)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPreferedTime([...preferredTime, hour]);
                                                } else {
                                                    setPreferedTime(preferredTime.filter((time) => time !== hour));
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
                            <p className={styles["time-slots-title"]}>Intervale selectate:</p>
                            <ul className={styles.options}>
                                {timeSlots.map((slot, index) => (
                                    <li key={index}>
                                        <span>{slot.date} - {slot.time}</span>
                                        <img src={edit} onClick={() => handleEditTimeSlot(index)} className={styles["edit-delete-button"] }
                                             />
                                        <img src={deleteI} onClick={() => handleDeleteTimeSlot(index)}className={styles["edit-delete-button"] } />

                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles["appointmentReason"]}>
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
                        {appointmentReasonMissingError && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {appointmentReasonMissingError}
                            </Alert>
                        )}
                    </div>
                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Box sx={modalStyle}>
                            <h2 className={styles.editT}>Editează intervalul orar</h2>
                            <div className={styles["hours-input"]} id="hours-input">
                                {["08:00 - 11:00", "13:00 - 16:00", "17:00 - 20:00"].map((hourE) => (
                                    <label key={hourE}  className={styles.labelHour}>
                                        <input
                                            type="checkbox"
                                            value={hourE}
                                            className={styles.checkBox}
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

                            <div className={styles.buttons}>
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
                            </div>
                        </Box>
                    </Modal>
                </LocalizationProvider>
            </div>
    );
}

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

export default RequestAppointmentKid;
