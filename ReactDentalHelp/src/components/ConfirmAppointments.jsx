import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/ConfirmAppointments.module.css"
import arrow_up from "../assets/icons/upload.png";
import arrow_down from "../assets/icons/arrow-down-sign-to-navigate.png";

function ConfirmAppointments() {
    const [appointmentsRequests, setAppointmentsRequests] = useState([]);
    const [confirmData, setConfirmData] = useState({});
    const [visibleSubmenu, setVisibleSubmenu] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Funcție pentru a extrage numele pacientului după CNP
    const fetchPatientByCnp = async (patientCnp) => {
        try {
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

    // Funcție pentru a obține toate cererile de programări
    const fetchAppointmentsRequests = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/admin/confirm-appointments/get-appointments-request",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = response.data.data;
            if (Array.isArray(data)) {
                // Folosim Promise.all pentru a aștepta numele pacienților înainte de a seta starea
                const apiAppReqs = await Promise.all(
                    data.map(async (appointmentRequest) => ({
                        appReason: appointmentRequest.appointmentReason,
                        appTime: appointmentRequest.desiredAppointmentTime,
                        patientCnp: appointmentRequest.patient.cnp,
                        patientName: await fetchPatientByCnp(appointmentRequest.patient.cnp), // Așteptăm numele
                        id: appointmentRequest.appointmentRequestId,
                    }))
                );
                setAppointmentsRequests(apiAppReqs);
                console.log(appointmentsRequests);
            } else {
                console.error("Datele primite nu sunt un array:", data);
            }
        } catch (error) {
            console.error("Eroare la preluarea cererilor de programare:", error);
        }
    };

    useEffect(() => {
        fetchAppointmentsRequests();
    }, []);

    const handleConfirm = async (id) => {
        const { date, start_time, end_time } = confirmData[id] || {};
        if (!date || !start_time || !end_time) {
            alert("Te rog introdu data și ora programării!");
            return;
        }

        const startAppointmentDateTimeObj = new Date(`${date}T${start_time}`);
        const startFormattedDate = startAppointmentDateTimeObj.toLocaleDateString("en-GB");
        const startFormattedTime = startAppointmentDateTimeObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const startAppointmentDateTime = `${startFormattedDate} ${startFormattedTime}`;

        const endAppointmentDateTimeObj = new Date(`${date}T${end_time}`);
        const endFormattedDate = endAppointmentDateTimeObj.toLocaleDateString("en-GB");
        const endFormattedTime = endAppointmentDateTimeObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const endAppointmentDateTime = `${endFormattedDate} ${endFormattedTime}`;
        const appointmentRequest = appointmentsRequests.find((request) => request.id === id);

        if (!appointmentRequest) {
            alert("Cererea de programare nu a fost găsită.");
            return;
        }
        console.log(appointmentRequest.patientCnp);

        try {
            await axios.post(
                `http://localhost:8080/api/admin/confirm-appointments/save-appointments`,
                {
                    startDateHour: startAppointmentDateTime,
                    appointmentRequestId: id,
                    endDateHour: endAppointmentDateTime,
                    cnpPatient: appointmentRequest.patientCnp,
                    appointmentReason: appointmentRequest.appReason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Cererea a fost confirmată!");
            fetchAppointmentsRequests();
        } catch (error) {
            console.error("Eroare la confirmarea cererii:", error);
            alert("Eroare la confirmarea cererii.");
        }
    };

    const handleChange = (id, field, value) => {
        setConfirmData((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                [field]: value,
            },
        }));
    };

    const toggleSubmenu = (id) => {
        setVisibleSubmenu((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handlePatientDetailsRedirect = (patientCnp) => {
        navigate(`/GeneralAdminBoard/specific-patient`, { state: { patientCnp } });
    };

    // Obținem data curentă și data maximă (peste 30 de zile)
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Formatăm ca YYYY-MM-DD
    };

    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today.setDate(today.getDate() + 30)); // Adăugăm 30 de zile
        return maxDate.toISOString().split("T")[0]; // Formatăm ca YYYY-MM-DD
    };

    return (
        <div>
            <h1 className={styles.titleAppReq}>Solicitări Programări</h1>
            {appointmentsRequests.length > 0 ? (
                <ul className={styles["requests"]}>
                    {appointmentsRequests.map((request) => (
                        <li className={styles["appointment_request"]}
                            key={request.id}
                        >
                            <p><strong>Motivul Programării:</strong> {request.appReason}</p>
                            <p><strong>Timpul Dorit:</strong> {request.appTime}</p>
                            <p>
                                <strong>Pacient:</strong>
                                <button className={styles["patient_link"]}
                                        onClick={() => handlePatientDetailsRedirect(request.patientCnp)}
                                        style={{
                                            color: "blue",
                                            cursor: "pointer",
                                            background: "none",
                                            border: "none",
                                        }}
                                >
                                    {request.patientName}
                                </button>
                            </p>

                            <img
                                className={styles['arrow']}
                                onClick={() => toggleSubmenu(request.id)}
                                src={visibleSubmenu[request.id] ? arrow_up : arrow_down}
                                alt={visibleSubmenu[request.id] ? "Mai puțin" : "Mai mult"}
                                style={{cursor: "pointer"}}
                            />
                            {visibleSubmenu[request.id] && (
                                <div style={{marginTop: "10px", marginBottom: "10px"}}>
                                    <p>Confirmați programarea</p>
                                    <input
                                        type="date"
                                        min={getCurrentDate()} // Data minimă este azi
                                        max={getMaxDate()} // Data maximă este peste 30 de zile
                                        onChange={(e) => handleChange(request.id, "date", e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        onChange={(e) => handleChange(request.id, "start_time", e.target.value)}
                                        placeholder="Ora de început"
                                    />
                                    <input
                                        type="time"
                                        onChange={(e) => handleChange(request.id, "end_time", e.target.value)}
                                        placeholder="Ora de final"
                                    />
                                    <div className={styles.buttons}>
                                        <button onClick={() => handleConfirm(request.id)}>
                                            Trimite Confirmarea
                                        </button>
                                        <button onClick={() => handleConfirm(request.id)}>
                                            Respinge Solicitarea
                                        </button>
                                    </div>

                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nu există cereri de programare disponibile.</p>
            )}
        </div>
    );
}

export default ConfirmAppointments;
