import styles from "../assets/css/NotificationsAdmin.module.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import trash_icon from "../assets/icons/delete.png"
import read_icon from "../assets/icons/letter.png"
import unread_icon from "../assets/icons/letter_unread.png"

import arrow_up from "../assets/icons/upload.png"
import arrow_down from "../assets/icons/arrow-down-sign-to-navigate.png"

function NotificationsAdmin() {

    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [patientNames, setPatientNames] = useState({});
    const [visibleSubmenu, setVisibleSubmenu] = useState({});

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/in/notifications/admin/get_notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200 && response.data.data != null) {
                console.log(response.data.data)
                setNotifications(response.data.data)
            }
        } catch (error) {
            console.error('Eroare la preluarea notificarilor', error);
        }
    };

    const deleteNotification = async (notificationId) =>{
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:8080/api/in/notifications/admin/delete_notification/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                alert("Notificare stearsa")
                fetchNotifications()
            }
        } catch (error) {
            console.error('Eroare la stergerea notificarii', error);
        }
    }

    const readNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/in/notifications/admin/read_notification/${notificationId}`,
                {}, // trimitem un obiect gol pentru că datele sunt transmise prin URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("Notificare marcata ca citita");
                fetchNotifications();
            }
        } catch (error) {
            console.error('Eroare la cititrea notificarii', error);
        }
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
            return "Pacient neidentificat"
        }
    };

    useEffect(() => {
        fetchNotifications()
    }, []);

    useEffect(() => {
        // Pentru fiecare notificare, preia numele pacientului
        const fetchPatientNames = async () => {
            const newPatientNames = {};
            for (const notification of notifications) {
                const patientName = await fetchPatientByCnp(notification.patientCnp);
                newPatientNames[notification.patientCnp] = patientName; // Asociază numele pacientului cu CNP-ul
            }
            setPatientNames(newPatientNames); // Actualizează starea cu numele pacienților
        };

        if (notifications.length > 0) {
            fetchPatientNames();
        }
    }, [notifications]); // Rulam efectul doar când `notifications` se schimbă


    const handlePatientDetailsRedirect = (patientCnp) => {
        navigate(`/GeneralAdminBoard/specific-patient`, { state: { patientCnp } });
    };


    const toggleSubmenu = (id) => {
        setVisibleSubmenu((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const extractHourFromTimeString = (time) =>{
        const [date, hour] = time.split(" ");
        return hour
    }
    const extractDateFromTimeString = (time) =>{
        const [date, hour] = time.split(" ");
        return date
    }

    return (
        <div>
            <h2>NOTIFICĂRI</h2>
            {notifications.length > 0 ? (
                <ul className={styles['notifications']}>
                    {notifications.map((notification) => (
                        <li
                            className={`${styles["notification"]} ${
                                notification.notificationStatus === "NEW" ? styles["unreadNotification"] : styles["readNotification"]
                            }`}
                            key={notification.notificationId}
                        >
                            <div className={styles["header_notifications"]}>
                                <div className={styles["tex_and_arrow"]}>
                                    <h3 className={styles["notification_title"]}>
                                        {notification.notificationType === "CANCEL_APPOINTMENT" ? "PROGRAMARE ANULATA" : "INTARZIERE PROGRAMARE"}
                                    </h3>
                                    <img
                                        className={styles['arrow']}
                                        onClick={() => toggleSubmenu(notification.notificationId)}
                                        src={visibleSubmenu[notification.notificationId] ? arrow_up : arrow_down}
                                        alt={visibleSubmenu[notification.notificationId] ? "Mai puțin" : "Mai mult"}
                                        style={{cursor: "pointer"}}
                                    />
                                </div>
                                <div className={styles["date_and_time"]}>
                                    <p className={styles["date_time_text"]}>Ora:{extractHourFromTimeString(notification.date)}</p>
                                    <p className={styles["date_time_text"]}>Data:{extractDateFromTimeString(notification.date)}</p>
                                </div>
                                <div className={styles["icons"]}>
                                    <div className={styles["trash_icon_container"]}>
                                        <img
                                            onClick={() => deleteNotification(notification.notificationId)}
                                            className={styles["trash_icon"]}
                                            src={trash_icon}
                                            alt="delete"
                                        />
                                        <span className={styles["tooltip"]}>Șterge notificarea</span>
                                    </div>
                                    <div className={styles["trash_icon_container"]}>
                                        <img
                                            onClick={() => readNotification(notification.notificationId)}
                                            className={styles["read_icon"]}
                                            src={notification.notificationStatus === "NEW" ? read_icon : unread_icon}
                                            alt="read"
                                        />
                                        <span className={styles["tooltip"]}>
                            {notification.notificationStatus === "NEW" ? "Marchează ca citit" : "Marchează ca necitit"}
                        </span>
                                    </div>
                                </div>
                            </div>

                            {visibleSubmenu[notification.notificationId] && (
                                <div className={styles["details_content"]}>
                                    <p>
                                        Pacient:
                                        <button
                                            className={styles["patient_link"]}
                                            onClick={() => handlePatientDetailsRedirect(notification.patientCnp)}
                                        >
                                            {patientNames[notification.patientCnp]}
                                        </button>
                                    </p>
                                    <p>Observatii: {notification.observations}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

            ) : (
                <p>Nu există notificari</p>
            )}
        </div>
    )
}


export default NotificationsAdmin