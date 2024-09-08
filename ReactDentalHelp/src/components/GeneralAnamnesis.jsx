import { useState } from "react";
import axios from "axios";
import {parseJwt} from "../service/authService.jsx";
import styles from '../assets/css/GeneralAnamnesis.module.css';

function GeneralAnamnesis() {
    const [allergies, setAllergies] = useState("");
    const [medicalIntolerance, setMedicalIntolerance] = useState("");
    const [previousDentalProblems, setPreviousDentalProblems] = useState("");
    const [alcohol, setAlcohol] = useState(null);
    const [smoke, setSmoke] = useState(null);
    const [coagulation, setCoagulation] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const decodedToken = parseJwt(token); // Funcția parseJwt pentru a decoda token-ul
            const cnp = decodedToken.cnp;
            const response = await axios.post(
                "http://localhost:8080/api/in/general-anamnesis",
                {
                    allergies: allergies,
                    medicalIntolerance: medicalIntolerance,
                    previousDentalProblems: previousDentalProblems,
                    alcoholConsumer: alcohol,
                    smoker: smoke,
                    coagulationProblems: coagulation,
                    cnp: cnp,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                    },
                }
            );

            if (response.status === 200) {
                console.log(
                    "Anamneza generala salvata cu succes a fost inregistrat cu succes",
                    response.data
                );
            } else {
                alert("Eroare la salvarea anamnezei: " + response.statusText);
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

    return (
        <div className={styles.anamnesisForm}>
            <h1 className={styles.title}>Anamneza generala</h1>

            <div className={styles['form-group']}>
                <label htmlFor="allergies-input">Alergii:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="allergies-input"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="medical-intolerance-input">Intoleranta la medicamente:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="medical-intolerance-input"
                    value={medicalIntolerance}
                    onChange={(e) => setMedicalIntolerance(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="previous-dental-problems-input">Probleme dentare trecute:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="previous-dental-problems-input"
                    value={previousDentalProblems}
                    onChange={(e) => setPreviousDentalProblems(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label>Consumati alcool?</label>
                <div className={styles['boolean-group']}>
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

            <div className={styles['form-group']}>
                <label>Fumati?</label>
                <div className={styles['boolean-group']}>
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

            <div className={styles['form-group']}>
                <label>Aveti probleme de coagulare?</label>
                <div className={styles['boolean-group']}>
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

            <button onClick={handleFormSubmit} className={styles.buttonSubmit}>
                Salveaza anamneza
            </button>
        </div>
    );
}

export default GeneralAnamnesis;
