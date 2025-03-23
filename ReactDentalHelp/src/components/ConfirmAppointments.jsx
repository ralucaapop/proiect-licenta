import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/ConfirmAppointments.module.css"
import arrow_up from "../assets/icons/upload.png";
import arrow_down from "../assets/icons/arrow-down-sign-to-navigate.png";
import InfoBox from "./InfoBox.jsx";
import {Box, Modal} from "@mui/material";

function ConfirmAppointments() {
    const [appointmentsRequests, setAppointmentsRequests] = useState([]);
    const [confirmData, setConfirmData] = useState({});
    const [visibleSubmenu, setVisibleSubmenu] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [infoConfirmAppBoxVisible, setConfirmAppBoxVisible] = useState(false);
    const [infoRejectAppBoxVisible, setRejectAppBoxVisible] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage]= useState("");
    const [rejectMessage, setRejectMessage] = useState("");
    const [confirmRejectRequest, setConfirmRejectRequest] = useState(false);
    const [selectedRequestForReject, setSelectedRequestForReject] = useState(false)

    const closeInfoConfirmAppBox = () => {
        setConfirmAppBoxVisible(false);
    };

    const closeInfoRejectAppBox = () => {
        setRejectAppBoxVisible(false);
    };
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
            setShowError(true);
            setErrorMessage("Completati fiecare camp!")
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
            setShowError(true);
            setErrorMessage("Cererea de programare nu a fost găsită.")
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
            setConfirmAppBoxVisible(true)
            fetchAppointmentsRequests();
        } catch (error) {
            setShowError(true);
            setErrorMessage("Eroare la confirmarea cererii.")
            console.error("Eroare la confirmarea cererii:", error);
        }
    };

    const handleCloseConfirmRejectRequest =()=>{
        setConfirmRejectRequest(false);
    }

    const handleOpenConfirmRejectRequest =(requestId)=>{
        setSelectedRequestForReject(requestId)
        setConfirmRejectRequest(true);
    }

    const rejectRequest = async ()=>{
        setConfirmRejectRequest(false);
        const appointmentRequest = appointmentsRequests.find((request) => request.id === selectedRequestForReject);
        if (!appointmentRequest) {
            setShowError(true);
            setErrorMessage("Cererea de programare nu a fost găsită.")
            return;
        }
        console.log(appointmentRequest.patientCnp);

        try {
            await axios.post(
                `http://localhost:8080/api/admin/confirm-appointments/rejectAppointment`,
                {
                    appointmentRequestId: selectedRequestForReject,
                    patientCNP: appointmentRequest.patientCnp,
                    message: rejectMessage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setConfirmAppBoxVisible(true)
            fetchAppointmentsRequests();
        } catch (error) {
            setShowError(true);
            setErrorMessage("Eroare la confirmarea cererii.")
            console.error("Eroare la confirmarea cererii:", error);
        }
    }

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

    const closeErrorModal = ()=>{
        setShowError(false);
    }

    return (
        <div className={styles.page}>
            {infoConfirmAppBoxVisible && <InfoBox message={"Confirmarea a fost efectuata"} onClose={closeInfoConfirmAppBox}/>}
            {infoRejectAppBoxVisible && <InfoBox message={"Solicitarea a fost respinsă"} onClose={closeInfoRejectAppBox}/>}
            <h1 className={styles.titleAppReq}>Solicitări Programări</h1>
            {appointmentsRequests.length > 0 ? (
                <ul className={styles["requests"]}>
                    {appointmentsRequests.map((request) => (
                        <li className={styles["appointment_request"]} key={request.id}>
                            <p><strong>Motivul Programării:</strong> {request.appReason}</p>
                            <p><strong>Timpul Dorit:</strong> {request.appTime}</p>
                            <div>
                                <strong>Pacient:</strong>
                                <button className={styles.patient_link}
                                        onClick={() => handlePatientDetailsRedirect(request.patientCnp)}>
                                    {request.patientName}
                                </button>
                            </div>
                            <div className={styles.arrow_section}>
                                <p>{visibleSubmenu[request.id] ? "Mai puțin" : "Mai mult"}</p>
                                <img
                                    className={styles.arrow}
                                    onClick={() => toggleSubmenu(request.id)}
                                    src={visibleSubmenu[request.id] ? arrow_up : arrow_down}
                                    alt={visibleSubmenu[request.id] ? "Mai puțin" : "Mai mult"}
                                />
                            </div>
                            {visibleSubmenu[request.id] && (
                                <div className={styles.confirmForm}>
                                    <p className={styles.confirmTitle}>Confirmați programarea</p>
                                    <input
                                        type="date"
                                        required
                                        min={getCurrentDate()}
                                        max={getMaxDate()}
                                        onChange={(e) => handleChange(request.id, "date", e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        required
                                        onChange={(e) => handleChange(request.id, "start_time", e.target.value)}
                                        placeholder="Ora de început"
                                    />
                                    <input
                                        type="time"
                                        required
                                        onChange={(e) => handleChange(request.id, "end_time", e.target.value)}
                                        placeholder="Ora de final"
                                    />
                                    <div className={styles.buttons}>
                                        <button className={styles.button} onClick={() => handleConfirm(request.id)}>
                                            Trimite Confirmarea
                                        </button>
                                        <button className={styles.button1} onClick={() => handleOpenConfirmRejectRequest(request.id)}>
                                            Respinge Solicitarea
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nu există solicitări pentru programări.</p>
            )}
            <Modal open={showError} onClose={closeErrorModal}>
                <Box className={styles.box}>
                    <p className={styles.changeRolT}>{errorMessage}</p>
                </Box>
            </Modal>
            <Modal open={confirmRejectRequest} onClose={handleCloseConfirmRejectRequest}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>Confirmare</h2>
                    <p className={styles.text}>
                        Ești sigur că dorești să respingi acestă solicitare?
                    </p>
                    <input
                        placeholder="Precizează intervale disponibile pentru pacient"
                        required
                        value={rejectMessage}
                        onChange={(e) => setRejectMessage(e.target.value)}
                    />
                    <button className={styles.actionButton} onClick={() => rejectRequest()}>
                        Da, respinge solicitare!
                    </button>
                    <button onClick={handleCloseConfirmRejectRequest}>Anulează!</button>
                </Box>
            </Modal>
        </div>
    );
}

export default ConfirmAppointments;
