import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseJwt } from "../service/authService.jsx"; // Asigură-te că ai o funcție care decodifică JWT-ul
import appointment_photo from '../assets/appointment-hisotry/dental-appointment.png';
import AppointmentAnamnesisForm from "./AppointmentAnamnesis.jsx";
import TreatmentSheetPatientView from "./TreatmentSheetPatientView.jsx";
import styles from "../assets/css/PatientAppointmentHistory.module.css"

//pacientul sa is vada toate programarile
function PatientAppointmentsHistory() {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patientName, setPatientName] = useState("")

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Preluăm token-ul din localStorage
                const token = localStorage.getItem('token');
                const decodedToken = parseJwt(token);
                const cnp = decodedToken.cnp;

                const response = await axios.post(
                    "http://localhost:8080/api/patient/appointments/get-patient-appointments",
                    { patientCnp: cnp },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                        },
                    }
                );

                if (response.status === 200) {
                    console.log(response.data.data)

                    const fetchedAppointments = response.data.data; // Obține programările din răspuns
                    setAppointments(fetchedAppointments); // Stabilește programările în state
                    if (fetchedAppointments.length > 0) {
                        const firstAppointment = fetchedAppointments[0];
                        setPatientName(firstAppointment.patient.lastName)
                    }
                } else {
                    console.error('Eroare la găsirea programărilor');
                }
            } catch (error) {
                console.error('Eroare la preluarea programărilor', error);
            }
        };
        fetchAppointments();
    }, []);

    const handleAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);

    };

    const formatDateTime = (dateString) => {
        // dateString is in the format "DD/MM/YYYY HH:mm"
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');

        const date = new Date(`${year}-${month}-${day}T${timePart}`);

        // Check if date is valid
        if (isNaN(date)) {
            return 'Invalid Date';
        }

        // Formatting the date output
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return `${formattedDate} ${formattedTime}`;
    };


    return (
        <div className={styles["appointments-history-container"]}>
            <div className={styles["appointments-list"]}>
                <h2>Istoricul programărilor dumneavoastră </h2>
                <ul>
                    {Array.isArray(appointments) && appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <li
                                key={appointment.appointmentId}
                                onClick={() => handleAppointmentClick(appointment)}
                                className={styles[selectedAppointment && selectedAppointment.id === appointment.id ? 'active' : "list-element"]}
                                style={{ display: 'flex', backgroundColor: 'white', alignItems: 'center', margin: '8px 0', cursor: 'pointer', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                            >
                                <img className={styles['appointment-img']} src={appointment_photo} alt="Appointment Icon" />
                                <span>{formatDateTime(appointment.date)} - {appointment.appointmentReason}</span>
                            </li>

                        ))
                    ) : (
                        <p>Nu există programări disponibile.</p>
                    )}
                </ul>
            </div>

            <div className={styles["appointment-details"]}>
                {selectedAppointment ? (
                    <div>
                        <h2>Detalii Programare</h2>
                        <p><strong>Data:</strong> {formatDateTime(selectedAppointment.date)}</p>
                        <p><strong>Motiv prezentare:</strong> {selectedAppointment.appointmentReason}</p>
                        <AppointmentAnamnesisForm appointmentId={selectedAppointment.appointmentId} appointmentReason={selectedAppointment.appointmentReason} />
                        <TreatmentSheetPatientView appointmentId={selectedAppointment.appointmentId} />
                    </div>
                ) : (
                    <p>Selectează o programare pentru a vedea detaliile.</p>
                )}
            </div>
        </div>
    );
}



export default PatientAppointmentsHistory;
