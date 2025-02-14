import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../assets/css/AppointmentAnamnesis.module.css";
import arrow_down from "../../assets/icons/arrow-down-sign-to-navigate.png";
import arrow_up from "../../assets/icons/upload.png";

function TreatmentSheetDoctor(props) {
    const [appointmentObservations, setAppointmentObservations] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [medication, setMedication] = useState("");
    const [showTreatmentSheetForm, setShowTreatmentSheetForm] = useState(false); // Show or hide the treatment sheet section
    const [isEditing, setIsEditing] = useState(false); // Whether we're editing or viewing the form
    const [isNewSheet, setIsNewSheet] = useState(false); // Whether the sheet is new or already exists
    const token = localStorage.getItem("token");

    // Fetch data and determine if the sheet already exists
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
                setIsNewSheet(false); // Set false if treatment sheet exists
            } else {
                setIsNewSheet(true); // If no data, set to true
            }
        } catch (error) {
            console.error("Eroare la obținerea datelor: ", error);
            setIsNewSheet(true); // Assume it's new if error
        }
    };

    useEffect(() => {
        fetchData();
        resetState();
    }, [props.appointmentId]);



    const resetState = ()=> {
            setMedication("");
            setAppointmentObservations("");
            setRecommendations("")
    };

    // Save the form (for creating or editing)
    const handleSave = async () => {
        try {
            const payload = {
                appointmentObservations,
                recommendations,
                medication,
                appointmentId: props.appointmentId
            };

            if (isNewSheet) {
                // Create new treatment sheet
                await axios.post(
                    `http://localhost:8080/api/in/treatment-sheet/save-treatment-sheet`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIsNewSheet(false); // Set to false after creation
            } else {
                // Update existing treatment sheet
                await axios.put(
                    `http://localhost:8080/api/in/treatment-sheet/update-sheet-treatment`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            setIsEditing(false); // Switch back to view mode after save
        } catch (error) {
            console.error("Eroare la salvarea datelor: ", error);
        }
    };


    const toggleAnamnesisForm = () => {
        setShowTreatmentSheetForm(!showTreatmentSheetForm);
    };

    return (
        <div>
            <div className={styles.actionButtons}>
                <button onClick={toggleAnamnesisForm} className={styles.anamnesisAppointmentButton}> Fisa medicala
                </button>
                <img className={styles["arrow"]} src={!showTreatmentSheetForm ? arrow_down : arrow_up}/>
            </div>

            {showTreatmentSheetForm && (
                <div>
                    {/* If the treatment sheet already exists, show options to view or edit */}
                    {!isNewSheet ? (
                        <div>
                            <button onClick={() => setIsEditing(false)}>
                                Vizualizeaza
                            </button>
                            <button onClick={() => setIsEditing(true)}>
                                Editeaza
                            </button>
                        </div>
                    ) : (
                        // If no treatment sheet exists, show form to create one
                        <p>Nu există o fișă de tratament. Completați fișa mai jos:</p>
                    )}

                    {/* Show editable form if in editing mode */}
                    {isEditing || isNewSheet ? (
                        <div>
                            <h3>{isNewSheet ? "Completare Fișă" : "Editare Fișă"}</h3>
                            <div className={styles.formGroup}>
                            <label>
                                Observații programare:
                                <input
                                    type="text"
                                    value={appointmentObservations}
                                    onChange={(e) =>
                                        setAppointmentObservations(e.target.value)
                                    }
                                />
                            </label>
                            </div>
                            <div className={styles.formGroup}>

                            <label>
                                Tratamente medicale:
                                <input
                                    type="text"
                                    value={medication}
                                    onChange={(e) => setMedication(e.target.value)}
                                />
                            </label>
                            </div>
                            <div className={styles.formGroup}>

                            <label>
                                Recomandări post intervenție:
                                <input
                                    type="text"
                                    value={recommendations}
                                    onChange={(e) => setRecommendations(e.target.value)}
                                />
                            </label>
                            </div>
                            <button onClick={handleSave} className={styles.saveAnamnesisButton}>
                                {isNewSheet ? "Salvează Fișa" : "Salvează Modificările"}
                            </button>
                        </div>
                    ) : (
                        // Show data if in view mode
                        <div className={styles.dataView}>
                            <h3>Vizualizare Fișă</h3>
                            <p><strong>Observații programare:</strong> {appointmentObservations}</p>
                            <p><strong>Tratamente medicale:</strong> {medication}</p>
                            <p><strong>Recomandări post tratament:</strong> {recommendations}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

TreatmentSheetDoctor.propTypes = {
    appointmentId: PropTypes.number.isRequired,
};

export default TreatmentSheetDoctor;
