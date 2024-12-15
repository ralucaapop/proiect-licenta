import {useNavigate} from "react-router-dom";
import Card from "./Card.jsx";
import appointmentCardPic from "../assets/cards_photos/appointment.png";
import patients from "../assets/cards_photos/patients.png";
import materials from "../assets/cards_photos/materials.png";
import styles from "../assets/css/MainPagePatient.module.css"
import NavBar from "./NavBar.jsx";

function MainPageAdmin(){

    const navigate = useNavigate();

    const handleAppointment = () => {
        navigate("/SchedulareAppointmentsPageAdmin");
    };
    const handlePatients = () => {
        navigate("/PatientsDoctor");
    };
    const handleMaterials = () => {
        navigate("/Materials");
    };
    return (
        <div className={styles["page"]}>
            <NavBar></NavBar>
            <div className={styles["cards"]}>
                <Card
                    onClick={handleAppointment}
                    title="Programari" image_source={appointmentCardPic} />
                <Card
                    onClick={handlePatients}
                    title="Pacienti"
                    image_source={patients}
                />
            </div>
        </div>
    );
}

export default MainPageAdmin;