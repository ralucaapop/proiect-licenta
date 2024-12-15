import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseJwt } from "../service/authService.jsx";
import appointment_photo from '../assets/appointment-hisotry/dental-appointment.png';
import appointment_request_photo from  '../assets/request_appointment_photo/request.png'
import AppointmentAnamnesisForm from "./AppointmentAnamnesis.jsx";
import TreatmentSheetPatientView from "./TreatmentSheetPatientView.jsx";
import styles from "../assets/css/PatientAppointmentHistory.module.css"

function PatientAppointmentsHistory() {
    const [appointments, setAppointments] = useState([]);
    const [appointmentRequests, setAppointmentRequests] = useState([]);

    const [selectedAppointmentRequest, setSelectedAppointmentRequest] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [showCancelRequestConfirmation, setShowCancelRequestConfirmation] = useState(false);

    const [showLateAppointment, setShowLateAppointment] = useState(false);


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
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log(response.data.data)

                const fetchedAppointments = response.data.data; // Obține programările din răspuns
                setAppointments(fetchedAppointments); // Stabilește programările în state
                if (fetchedAppointments.length > 0) {
                    const firstAppointment = fetchedAppointments[0];
                }
            } else {
                console.error('Eroare la găsirea programărilor');
            }
        } catch (error) {
            console.error('Eroare la preluarea programărilor', error);
        }
    };

    useEffect(() => {
        fetchAppointmentsRequests();
        fetchAppointments();
    }, []);

    const handleAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);
        setSelectedAppointmentRequest(null); // Reset appointment request selection
    };

    const handleAppointmentRequestClick = (appointmentRequest) => {
        setSelectedAppointmentRequest(appointmentRequest);
        setSelectedAppointment(null); // Reset appointment selection
    };

    const fetchAppointmentsRequests = async () => {
        try {
            // Preluăm token-ul din localStorage
            const token = localStorage.getItem('token');
            const decodedToken = parseJwt(token);
            const cnp = decodedToken.cnp;
            console.log(cnp)
            const response = await axios.get(
                `http://localhost:8080/api/in/appointment_request/get_patient_requests/${cnp}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                    },
                }
            );

            if (response.status === 200) {
                console.log(response.data.data)

                const fetchedAppointmentRequests = response.data.data; // Obține programările din răspuns
                setAppointmentRequests(fetchedAppointmentRequests); // Stabilește programările în state

            } else {
                console.error('Eroare la găsirea solicitarilor de programărilor');
            }
        } catch (error) {
            console.error('Eroare la preluarea solicitarilor de programări', error);
        }
    };


    const handleCancelAppointment = async (appointmentId)  => {
        if (appointmentId) {
            try{
                const token = localStorage.getItem('token');
                const patientCnp = parseJwt(token).cnp

                const now = new Date();
                const day = String(now.getDate()).padStart(2, "0");
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, "0");
                const minutes = String(now.getMinutes()).padStart(2, "0");
                const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;

                const response = await axios.post(
                    `http://localhost:8080/api/in/notifications/admin/send_notification/cancel_appointment/${appointmentId}`,
                    {
                        date:formattedDateTime,
                        patientCnp: patientCnp
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    }
                );

                if (response.status === 200) {
                    console.log(
                        "Programare anulata cu succes",
                        response.data
                    );
                    alert("Programarea dumneavoastra a fost anulata")
                    fetchAppointments()
                    setShowCancelConfirmation(false)
                    setSelectedAppointment(null)
                } else {
                    alert("Eroare la anularea programarii: " + response.statusText);
                }
            }
            catch (error) {
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message
                );
                alert(
                    "Eroare la anularea programarii: " +
                    (error.response ? error.response.data.message : error.message)
                );
            }
        }
    };

    const handleLateAppointment = async (selectedEventId)  => {
        if (selectedEventId) {
            try{
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
                    console.log(
                        "Intarziere anuntata cu succes",
                        response.data
                    );
                    alert("Intarzierea a fost anulata anuntata")
                    fetchAppointments()
                    setShowCancelConfirmation(false)
                    setSelectedAppointment(null)
                } else {
                    alert("Eroare la anuntarea intarzierii la programare: " + response.statusText);
                }
            }
            catch (error) {
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message
                );
                alert(
                    "Eroare la anularea programarii: " +
                    (error.response ? error.response.data.message : error.message)
                );
            }
        }
    };


    const handleDeleteAppointmentRequest = async (selectedEventId) =>{
        if (selectedEventId) {
            console.log(selectedEventId)
            try{
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `http://localhost:8080/api/in/appointment_request/delete_request/${selectedEventId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    alert("Solicitarea dumneavoastra a fost anulata")
                    fetchAppointmentsRequests()
                    setShowCancelRequestConfirmation(false)
                    setSelectedAppointmentRequest(null)
                } else {
                    alert("Eroare la anularea solicitarii programarii: " + response.statusText);
                }
            }
            catch (error) {
                console.error(
                    "Eroare de la server:",
                    error.response ? error.response.data : error.message);
                alert(
                    "Eroare la anularea solicitarii programarii: " +
                    (error.response ? error.response.data.message : error.message)
                );
            }
        }
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

    const isFutureDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const time = timePart || '00:00'; // Asigură-te că există o componentă de timp

        // Creează un string compatibil ISO pentru constructorul Date
        const isoString = `${year}-${month}-${day}T${time}`;

        // Creează obiectul Date din stringul ISO
        const appointmentDate = new Date(isoString);

        // Obține data curentă
        const currentDate = new Date();

        // Compară dacă data programării este în viitor
        return appointmentDate > currentDate;
    };

    const handleShowCancelConfirmation = () => {
        setShowCancelConfirmation(true);
    };

    const handleShowCancelRequestConfirmation = () => {
        setShowCancelRequestConfirmation(true);
    };


    const handleCancelClick = () => {
        setShowCancelConfirmation(false);
    };

    const handleCancelRequestClick = () => {
        setShowCancelRequestConfirmation(false);
    };

    const handleShowLateAppointment = () => {
        setShowLateAppointment(true);
    };

    const handleCancelClickLate = () => {
        setShowLateAppointment(false);
    };


    return (
        <div className={styles["appointments-history-container"]}>
                <div className={styles["appointments-list"]}>
                    <p className={styles["appointments-title"]}>Istoricul programărilor dumneavoastră </p>
                    <ul>
                        {Array.isArray(appointments) && appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <li
                                    key={appointment.appointmentId}
                                    onClick={() => handleAppointmentClick(appointment)}
                                    className={ styles[selectedAppointment && selectedAppointment.appointmentId === appointment.appointmentId ? 'active' : "list-element"]}
                                >
                                    <img className={styles['appointment-img']} src={appointment_photo}
                                         alt="Appointment Icon"/>
                                    <span>{formatDateTime(appointment.date)} - {appointment.appointmentReason}</span>
                                </li>

                            ))
                        ) : (
                            <p>Nu există programări disponibile.</p>
                        )}
                    </ul>
                    <ul>
                        <p className={styles["appointments-title"]}>Solicitari programari</p>
                        {Array.isArray(appointmentRequests) && appointmentRequests.length > 0 ? (
                            appointmentRequests.map((appointmentRequest) => (
                                <li
                                    key={appointmentRequest.appointmentRequestId}
                                    onClick={() => handleAppointmentRequestClick(appointmentRequest)}
                                    className={styles[selectedAppointmentRequest && selectedAppointmentRequest.appointmentRequestId === appointmentRequest.appointmentRequestId ? 'active' : "list-element"]}

                                >
                                    <img className={styles['appointment-img']} src={appointment_request_photo}
                                         alt="Appointment Icon"/>
                                    <span>{appointmentRequest.requestDate}</span>
                                </li>

                            ))
                        ) : (
                            <p>Nu există solicitari curente.</p>
                        )}
                    </ul>
                </div>

                <div className={styles["appointment-details"]}>
                    {selectedAppointment ? (
                        <div>
                            <h2>Detalii Programare</h2>
                            <p><strong>Data:</strong> {formatDateTime(selectedAppointment.date)}</p>
                            <p><strong>Motiv prezentare:</strong> {selectedAppointment.appointmentReason}</p>
                            <AppointmentAnamnesisForm appointmentId={selectedAppointment.appointmentId}
                                                      appointmentReason={selectedAppointment.appointmentReason}/>
                            <TreatmentSheetPatientView appointmentId={selectedAppointment.appointmentId}/>

                            {isFutureDate(selectedAppointment.date) && (
                                <div>
                                    {!showCancelConfirmation ? (
                                        <button onClick={handleShowCancelConfirmation}>
                                            Anulează programare
                                        </button>
                                    ) : (
                                        <div className={styles["cancel-section"]}>
                                            <p className={styles["cancel-message"]}>
                                                Doriți să anulați această programare? Odată confirmată anularea, medicul
                                                va fi informat și veți putea face o nouă programare ulterior.
                                            </p>
                                            <div className={styles["action-buttons"]}>
                                                <button onClick={()=>handleCancelAppointment(selectedAppointment.appointmentId)}
                                                        className={styles["confirm-button"]}>
                                                    Confirmă anularea
                                                </button>
                                                <button onClick={handleCancelClick} className={styles["close-button"]}>
                                                    Renunta
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {!showLateAppointment ? (
                                        <button onClick={handleShowLateAppointment}>
                                            Anunta intraziere
                                        </button>
                                    ) : (
                                        <div className={styles["cancel-section"]}>
                                            <p className={styles["cancel-message"]}>
                                                Vă informăm că aveți posibilitatea de a anunța medicul despre orice
                                                întârziere
                                                în sosirea dumneavoastră. Aceasta ne ajută să ne organizăm programul și
                                                să
                                                vă oferim cea mai bună experiență posibilă. Vă mulțumim pentru
                                                înțelegere! </p>
                                            <div className={styles["action-buttons"]}>
                                                <button onClick={handleLateAppointment}
                                                        className={styles["confirm-button"]}>
                                                    Confirmă intarziere
                                                </button>
                                                <button onClick={handleCancelClickLate}
                                                        className={styles["close-button"]}>
                                                    Renunta
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            )}
                        </div>
                    ) : selectedAppointmentRequest ? (
                            <div>
                                <h2>Detalii Solicitare Programare</h2>
                                <p><strong>Data solicitării:</strong> {selectedAppointmentRequest.requestDate}</p>
                                <p><strong>Motiv solicitare:</strong> {selectedAppointmentRequest.appointmentReason}</p>
                                <p><strong>Timpul dorit:</strong> {selectedAppointmentRequest.desiredAppointmentTime}</p>
                                <p><strong>Status:</strong> IN ASTEPTARE</p>

                                {!showCancelRequestConfirmation ? (
                                    <button onClick={handleShowCancelRequestConfirmation}>
                                        Anulează solicitarea
                                    </button>
                                ) : (
                                    <div className={styles["cancel-section"]}>
                                        <p className={styles["cancel-message"]}>
                                            Doriți să anulați această solicitare? Odată confirmată anularea,actiunea este ireversibila.
                                        </p>
                                        <div className={styles["action-buttons"]}>
                                            <button onClick={() => handleDeleteAppointmentRequest(selectedAppointmentRequest.appointmentRequestId)}
                                                    className={styles["confirm-button"]}>
                                                Confirmă anularea
                                            </button>
                                            <button onClick={handleCancelRequestClick} className={styles["close-button"]}>
                                                Renunta
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )

                        : (
                            <p>Selectează o programare sau o solicitare pentru a vedea detaliile.</p>
                    )}
                </div>
            </div>
    );
}


export default PatientAppointmentsHistory;
