import { useState, useEffect } from "react";
import axios from "axios";
import { parseJwt } from "../service/authService.jsx";
import styles from "../assets/css/GeneralAnamnesis.module.css";

function GeneralAnamnesis() {
    const [allergies, setAllergies] = useState("");
    const [medicalIntolerance, setMedicalIntolerance] = useState("");
    const [previousDentalProblems, setPreviousDentalProblems] = useState("");
    const [alcohol, setAlcohol] = useState(null);
    const [smoke, setSmoke] = useState(null);
    const [coagulation, setCoagulation] = useState(null);
    const [dataExists, setDataExists] = useState(false); // Check if data exists
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(true); // Default to view mode

    const token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);

    // Function to check if data exists and fetch it
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/in/general-anamnesis/get-general-anamnesis/${decodedToken.cnp}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 && response.data.data) {
                console.log(response.data.data)
                setAllergies(response.data.data.allergies);
                setMedicalIntolerance(response.data.data.medicalIntolerance);
                setPreviousDentalProblems(response.data.data.previousDentalProblems);
                setAlcohol(response.data.data.alcoholConsumer);
                setSmoke(response.data.data.smoker);
                setCoagulation(response.data.data.coagulationProblems);
                setDataExists(true); // Data exists, enable editing and viewing options
            }
        } catch (error) {
            console.error("Eroare la obținerea datelor: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const requestData = {
            allergies,
            medicalIntolerance,
            previousDentalProblems: previousDentalProblems,
            alcoholConsumer: alcohol,
            smoker: smoke,
            coagulationProblems: coagulation,
            cnp: decodedToken.cnp,
        };
        console.log(requestData.cnp);
        try {
            const url = dataExists
                ? "http://localhost:8080/api/in/general-anamnesis/update-general-anamnesis" // Edit (PUT)
                : "http://localhost:8080/api/in/general-anamnesis/add-general-anamnesis"; // Add (POST)
            const method = dataExists ? "put" : "post";

            const response = await axios({
                method: method,
                url: url,
                data: requestData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert(
                    dataExists
                        ? "Anamneza a fost actualizată cu succes"
                        : "Anamneza a fost completată cu succes"
                );
                fetchData(); // Refresh data
                setIsEditing(false);
                setIsViewing(true); // Return to view mode after saving
            } else {
                alert("Eroare la salvarea/actualizarea anamnezei: " + response.statusText);
            }
        } catch (error) {
            console.error(
                "Eroare de la server:",
                error.response ? error.response.data : error.message
            );
            alert(
                "Eroare la salvarea inregistrarii: " +
                (error.response ? error.response.data.message : error.message)
            );
        }
    };

    // Function to toggle view mode
    const handleView = () => {
        setIsViewing(true);
        setIsEditing(false);
    };

    // Function to toggle edit mode
    const handleEdit = () => {
        setIsEditing(true);
        setIsViewing(false);
    };

    return (
        <div className={styles.anamnesisForm}>
            <h1 className={styles.title}>Anamneza generală</h1>

            {/* Action buttons */}
            <div className={styles.actionButtons}>
                <button onClick={handleView} className={styles.buttonSubmit}>
                    Vizualizare anamneză
                </button>
                <button onClick={handleEdit} className={styles.buttonSubmit}>
                    Editare anamneză
                </button>
            </div>

            {/* Form for edit or add */}
            {isEditing && (
                <form onSubmit={handleFormSubmit}>
                    <div className={styles["form-group"]}>
                        <label htmlFor="allergies-input">Alergii:</label>
                        <input
                            type="text"
                            placeholder="scrieți răspunsul"
                            required
                            id="allergies-input"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label htmlFor="medical-intolerance-input">Intoleranță la medicamente:</label>
                        <input
                            type="text"
                            placeholder="scrieți răspunsul"
                            required
                            id="medical-intolerance-input"
                            value={medicalIntolerance}
                            onChange={(e) => setMedicalIntolerance(e.target.value)}
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label htmlFor="previous-dental-problems-input">Probleme dentare trecute:</label>
                        <input
                            type="text"
                            placeholder="scrieți răspunsul"
                            required
                            id="previous-dental-problems-input"
                            value={previousDentalProblems}
                            onChange={(e) => setPreviousDentalProblems(e.target.value)}
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Consumați alcool?</label>
                        <div className={styles["boolean-group"]}>
                            <label>
                                <input
                                    type="radio"
                                    name="alcohol"
                                    value="true"
                                    checked={alcohol === true}
                                    onChange={() => setAlcohol(true)}
                                />
                                Da
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="alcohol"
                                    value="false"
                                    checked={alcohol === false}
                                    onChange={() => setAlcohol(false)}
                                />
                                Nu
                            </label>
                        </div>
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Fumați?</label>
                        <div className={styles["boolean-group"]}>
                            <label>
                                <input
                                    type="radio"
                                    name="smoke"
                                    value="true"
                                    checked={smoke === true}
                                    onChange={() => setSmoke(true)}
                                />
                                Da
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="smoke"
                                    value="false"
                                    checked={smoke === false}
                                    onChange={() => setSmoke(false)}
                                />
                                Nu
                            </label>
                        </div>
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Aveți probleme de coagulare?</label>
                        <div className={styles["boolean-group"]}>
                            <label>
                                <input
                                    type="radio"
                                    name="coagulation"
                                    value="true"
                                    checked={coagulation === true}
                                    onChange={() => setCoagulation(true)}
                                />
                                Da
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="coagulation"
                                    value="false"
                                    checked={coagulation === false}
                                    onChange={() => setCoagulation(false)}
                                />
                                Nu
                            </label>
                        </div>
                    </div>

                    <button type="submit" className={styles.buttonSubmit}>
                        Salvează modificările
                    </button>
                </form>
            )}

            {/* Data view */}
            {isViewing && dataExists && (
                <div className={styles.dataView}>
                    <p><strong>Alergii:</strong> {allergies}</p>
                    <p><strong>Intoleranță la medicamente:</strong> {medicalIntolerance}</p>
                    <p><strong>Probleme dentare trecute:</strong> {previousDentalProblems}</p>
                    <p><strong>Consumați alcool:</strong> {alcohol ? "Da" : "Nu"}</p>
                    <p><strong>Fumați:</strong> {smoke ? "Da" : "Nu"}</p>
                    <p><strong>Probleme de coagulare:</strong> {coagulation ? "Da" : "Nu"}</p>
                </div>
            )}
        </div>
    );
}

export default GeneralAnamnesis;
