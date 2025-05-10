import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import {Dialog, styled} from '@mui/material';
import { Modal, Box, Button, TextField, Alert } from '@mui/material';
import styles from "../assets/css/RequestAppointment.module.css";
import {parseJwt} from "../service/authService.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import requestAppointmentImage from "../assets/request_appointment_photo/request_appointment.png";
import requestAppIntro from "../assets/request_appointment_photo/onlineAppointment.png"
import NavBar from "./NavBar.jsx";
import edit from "../assets/icons/edit.png";
import deleteI from "../assets/icons/delete.png";
import InfoBox from "./InfoBox.jsx";
import roLocale from 'date-fns/locale/ro'; // ← limba română
import dayjs from 'dayjs';
import 'dayjs/locale/ro';
dayjs.locale('ro');

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
    const [infoRequestAppointmentBoxVisible, setInfoRequestAppointmentBoxVisible] = useState(false);
    const [errorMessageBox, setErrorMessageBox] = useState("");
    const [showErrorBox, setShowErrorBox] = useState(false)
    const [titleMsg, setTitleMsg] = useState("Eroare")
    const handleCloseErrorBox = ()=>{
        setShowErrorBox(false);
    }

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
            setAppointmentError("Trebuie să selectați cel puțin o dată");
        else if(!appointmentReason)
        {
            setAppointmentReasonMissingError("Trebuie să specificați motivul programării");
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
                    setTitleMsg(true);
                    setTimeError("Soliciatea a fost trimisă");
                    setErrorMessageBox(`Solicitare programare trimisă: ${formattedTimeSlots}`);
                    setShowErrorBox(true);
                    navigator('/GeneralPatientBoard/history')
                    console.log(
                        "Cerere programare trimisa cu succes",
                        response.data
                    );
                } else {
                    setShowErrorBox(true);
                    setErrorMessageBox("Eroare la trimiterea solicitarii: " + response.statusText);
                }
            } catch (error) {
                setShowErrorBox(true);
                if(error.response)
                    setErrorMessageBox(error.response.data.message);
                else
                    setErrorMessageBox(error.message);
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message
                );
            }
        }
    }
    const closeInfoRequestAppointmentBox = () => {
        setInfoRequestAppointmentBoxVisible(false);
    };

    return (

        <div className={styles.page}>
            <Modal open={showErrorBox} onClose={handleCloseErrorBox}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>{titleMsg}</h2>
                    <p className={styles.text}>{errorMessageBox}
                    </p>
                </Box>
            </Modal>
            <NavBar></NavBar>
            <div className={styles["introduction"]}>
                <img className={styles["intro-photo"]} src={requestAppIntro}></img>
                <p className={styles["intro-paragraph"]}>
                    Rezervă-ți consultația stomatologică online și scapă de grija telefoanelor sau a cozii la recepție.
                    Platforma noastră îți permite să îți gestionezi programările rapid și eficient,
                    oferindu-ți controlul complet asupra timpului tău.
                </p>
            </div>

            <div className={styles["content"]}>
                <LocalizationProvider dateAdapter={AdapterDayjs} className={styles["components"]} adapterLocale={roLocale}>
                        <div className={styles["calendar-part"]}>
                            <h2 className={styles["title"]}>Selectează data în care dorești o programare</h2>
                            <StyledStaticDatePicker
                                value={selectedDate}
                                onChange={(newDate) => setSelectedDate(newDate)}
                                minDate={today}
                                maxDate={maxDate}
                                displayStaticWrapperAs="desktop"
                                shouldDisableDate={shouldDisableDate}
                            />
                        </div>

                    <div className={styles["text-part"]}>
                        <div className={styles['form-group']}>
                            <h2 className={styles.date}>Data selectată: {selectedDate.format('DD/MM/YYYY')}</h2>
                            <p htmlFor="hours-input">Selecteză intervalul/intervalele în care ești disponibil la această dată</p>
                            <div className={styles["hours-input"]} id="hours-input">
                                {["08:00 - 11:00", "13:00 - 16:00", "17:00 - 20:00"].map((hour) => (
                                    <label key={hour}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkBox}
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

                        {infoRequestAppointmentBoxVisible && <InfoBox message={"Solicitarea a fost trimisă cu succes"} onClose={closeInfoRequestAppointmentBox}/>}

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
                            <p className={styles["time-slots-title"]}>Intervale selectate:</p>
                            <ul>
                                {timeSlots.map((slot, index) => (
                                    <li key={index}>
                                        <span>{slot.date} - {slot.time}</span>
                                        <div className={styles.buttonsE}>
                                        <img src={edit} onClick={() => handleEditTimeSlot(index)}
                                             className={styles["edit-delete-button"]}
                                        />
                                        <img src={deleteI} onClick={() => handleDeleteTimeSlot(index)}
                                             className={styles["edit-delete-button"]}/>
                                        </div>
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
                                    Selectează motivul programării
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
                            {appointmentReasonMissingError && (
                                <Alert severity="error" sx={{mt: 2}}>
                                    {appointmentReasonMissingError}
                                </Alert>
                            )}
                            <button className={styles["add-timeslot-button"]} onClick={handleSendRequest}>Trimite Solicitarea</button>
                            {appointmentError && (
                                <Alert severity="error" sx={{mt: 2}}>
                                    {appointmentError}
                                </Alert>
                            )}
                        </div>


                    </div>

                    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className={styles.modalStyle}>
                            <h2 className={styles.editT}>Editează intervalul orar</h2>
                            <div className={styles["hours-input"]} id="hours-input">
                                {["08:00 - 11:00", "13:00 - 16:00", "17:00 - 20:00"].map((hourE) => (
                                    <label key={hourE} className={styles.labelHour}>
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


                            <button onClick={handleSaveEdit}>
                                Salvează
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                            >
                                Renunță
                            </button>
                            </div>

                    </Dialog>
                </LocalizationProvider>
            </div>
        </div>
    );
}


export default RequestAppointment;
