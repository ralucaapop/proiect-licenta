import Card from "./Card.jsx";
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
        navigate("/PatientHistoryData");
    };
    const handleRequestAppointment = () => {
        navigate("/RequestAppointment");
    };
    return (
        <div className={styles["page"]}>
            <NavBar></NavBar>
            <div className={styles["cards"]}>
                <Card
                    onClick={handleRequestAppointment}
                    title="Cere o programare" image_source={appointmentCardPic} />
                <Card
                    onClick={handleClickPersonalData}
                    title="Istoric programari Date Personale"
                    image_source={medicalHistoryCardPic}
                />
                <Card
                    onClick={handleClickKids}
                    title="Copii" image_source={kidsCardPic} />
                </div>
        </div>
    );
}

export default PatientMainPage;
