import appointmentCardPic from "../assets/cards_photos/appointment.png";
import kidsCardPic from "../assets/cards_photos/kids.png";
import medicalHistoryCardPic from "../assets/cards_photos/health-report.png";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import styles from "../assets/css/PatientMainPage.module.css";

function PatientMainPage() {
    const navigate = useNavigate();

    const handleClickPersonalData = () => {
        navigate("/PatientHistoryData");
    };
    const handleClickKids = () => {
        navigate("/KidsMainPage");
    };
    const handleRequestAppointment = () => {
        navigate("/RequestAppointment");
    };

    return (
        <div className={styles.page}>
            <NavBar />
            <div className={styles.cards}>
                <div className={styles.card} onClick={handleRequestAppointment}>
                    <img src={appointmentCardPic} alt="Appointment" />
                    <h3 className={styles["card-title"]}>Cere o programare</h3>
                    <p className={styles["card-description"]}>Rezervați o întâlnire rapidă și ușor.</p>
                </div>

                <div className={styles.card} onClick={handleClickPersonalData}>
                    <img src={medicalHistoryCardPic} alt="Medical History" />
                    <h3 className={styles["card-title"]}>Istoric și Date Personale</h3>
                    <p className={styles["card-description"]}>Accesează istoricul medical și datele tale personale.</p>
                </div>

                <div className={styles.card} onClick={handleClickKids}>
                    <img src={kidsCardPic} alt="Kids" />
                    <h3 className={styles["card-title"]}>Copii</h3>
                    <p className={styles["card-description"]}>Gestionează programările și informațiile medicale ale copiilor.</p>
                </div>
            </div>
        </div>
    );
}

export default PatientMainPage;
