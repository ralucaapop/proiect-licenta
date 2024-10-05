import { useNavigate } from "react-router-dom";
import styles from "../assets/css/Home.module.css";
import {isTokenValid, parseJwt} from "../service/authService.jsx";
import NavBar from "./NavBar.jsx";
import first_img from "../assets/home_photo/1.png";
import stain from "../assets/home_photo/pata.png";

function Home() {
    const navigate = useNavigate();

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token && isTokenValid(token);
    };

    const handleAppointmentClick = () => {
        if (isAuthenticated()) {
            const token = localStorage.getItem('token')
            const decodedToken = parseJwt(token)
            if(decodedToken.role === "PATIENT")
                {navigate("/RequestAppointment");}
            else{
                navigate("MainPageAdmin");
            }
        } else {
            navigate("/Login");
        }
    };

    return (
        <div className={styles.page}>
            <NavBar></NavBar>
            <div className={styles["content-container"]}>
                <div className={styles["text-content"]}>
                    <h1 className={styles.title}>DENTALCARE</h1>
                    <p className={styles.subtitle}>
                        Fie că sunteți aici pentru un control de rutină sau pentru o transformare completă,<br/> suntem aici pentru a vă ajuta să obțineți zâmbetul visurilor dumneavoastră.
                    </p>
                    <p className={styles.proposition}>Zâmbetul tău <br/> pasiunea noastra</p>
                    <button onClick={handleAppointmentClick} className={styles["appointment-button"]}>
                        Cere o programare
                    </button>
                </div>
                <div className={styles["right-images"]}>
                    <img src={first_img} className={styles["right-image"]} alt="Right Image" />
                    <img src={stain} className={styles["stain-image"]} alt="Spot Image" />
                </div>
            </div>
        </div>
    );

}

export default Home;
