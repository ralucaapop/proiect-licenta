import axios from "axios";
import {useEffect, useState} from "react";
import styles from "../assets/css/GeneralAnamnesis.module.css";
import PropTypes from "prop-types";

function TreatmentSheetPatientView(props){

    const [appointmentObservations, setAppointmentObservations] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [medication, setMedication] = useState("");
    const [showTreatmentSheetForm, setShowTreatmentSheetForm] = useState(false); // Default to view mode
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/in/treatment-sheet/get-treatment-sheet/${props.appointmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 && response.data.data) {
                setAppointmentObservations(response.data.data.appointmentObservations);
                setMedication(response.data.data.medication);
                setRecommendations(response.data.data.recommendations);
            }
        } catch (error) {
            console.error("Eroare la obținerea datelor: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [props.appointmentId]);
    const toggleTreatmentForm = () => {
        setShowTreatmentSheetForm(!showTreatmentSheetForm); // Comută vizibilitatea formularului
    };
    return (
        <div className="form">
            {/* Action buttons */}
            <div className={styles.actionButtons}>
                <button onClick={toggleTreatmentForm} className={styles.buttonSubmit}>
                    {showTreatmentSheetForm ? 'Închide Fisa Tratement' : 'Deschide Fisa Tratament'}

                </button>
            </div>
            {showTreatmentSheetForm &&(
                <div className={styles.dataView}>
                    <p><strong>Observatile programarii:</strong> {appointmentObservations}</p>
                    <p><strong>Tratement medical:</strong> {medication}</p>
                    <p><strong>Recomandari post tratament:</strong>{recommendations}</p>
                </div>
            )}
        </div>
    )

}

TreatmentSheetPatientView.propTypes = {
    appointmentId: PropTypes.number.isRequired
};
export default TreatmentSheetPatientView