import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../assets/css/GeneralAnamnesis.module.css";

function AppointmentAnamnesisForm(props) {
    const [anamnesisExists, setAnamnesisExists] = useState(false);
    const [currentMedication, setCurrentMedication] = useState('');
    const [recentMedication, setRecentMedication] = useState('');
    const [currentSymptoms, setCurrentSymptoms] = useState('');
    const [pregnancy, setPregnancy] = useState(null); // Setat la null pentru a evita confuziile
    const [showAnamnesisForm, setShowAnamnesisForm] = useState(false); // Controlează afișarea formularului

    // Funcția pentru a prelua anamneza de la API
    const fetchAnamnesis = async () => {
        if (props.appointmentId == null) {
            setAnamnesisExists(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/in/appointment/getAnamnesisAppointment/${props.appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.data.data === null) {
                setAnamnesisExists(false);
                setCurrentMedication('');
                setRecentMedication('');
                setCurrentSymptoms('');
                setPregnancy(null);
            } else if (response.status === 200 && response.data.data != null) {
                setCurrentMedication(response.data.data.currentMedication || '');
                setRecentMedication(response.data.data.recentMedication || '');
                setCurrentSymptoms(response.data.data.currentSymptoms || '');
                setPregnancy(response.data.data.pregnancy);
                setAnamnesisExists(true); // Setează true dacă anamneza există
            }
        } catch (error) {
            console.error('Eroare la preluarea anamnezei', error);
            setAnamnesisExists(false); // Permite editarea în caz de eroare
        }
    };

    useEffect(() => {
        fetchAnamnesis();
    }, [props.appointmentId]); // Observăm schimbările la appointmentId

    // Funcția pentru a salva anamneza
    const handleSaveAnamnesis = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:8080/api/in/appointment/saveAppointmentAnamnesis`,
                {
                    appointmentId: props.appointmentId,
                    appointmentReason: props.appointmentReason,
                    currentMedication,
                    recentMedication,
                    currentSymptoms,
                    pregnancy
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setAnamnesisExists(true); // Setează că anamneza acum există
                setCurrentMedication('');
                setRecentMedication('');
                setCurrentSymptoms('');
                setPregnancy(null);
                fetchAnamnesis(); // Actualizează datele după salvare
            }
        } catch (error) {
            console.error('Eroare la salvarea anamnezei', error);
        }
    };

    // Funcția pentru a controla deschiderea/închiderea formularului
    const toggleAnamnesisForm = () => {
        setShowAnamnesisForm(!showAnamnesisForm); // Comută vizibilitatea formularului
    };

    return (
        <div className="anamnesis-container">

            {/* Buton pentru deschiderea/închiderea formularului */}
            <button onClick={toggleAnamnesisForm} className={styles.buttonSubmit}>
                {showAnamnesisForm ? 'Închide Anamneza' : 'Deschide Anamneza'}
            </button>

            {/* Formularul de anamneză - afișat doar când showAnamnesisForm este true */}
            {showAnamnesisForm && (
                <div>
                    {!anamnesisExists ? (
                        <div>
                            <div className={styles['form-group']}>
                                <label htmlFor="current-medication-input">Medicație curentă:</label>
                                <input
                                    type="text"
                                    placeholder="scrieți răspunsul"
                                    required
                                    id="current-medication-input"
                                    value={currentMedication}
                                    onChange={(e) => setCurrentMedication(e.target.value)}
                                />
                            </div>

                            <div className={styles['form-group']}>
                                <label htmlFor="recent-medication-input">Medicație recentă:</label>
                                <input
                                    type="text"
                                    placeholder="scrieți răspunsul"
                                    required
                                    id="recent-medication-input"
                                    value={recentMedication}
                                    onChange={(e) => setRecentMedication(e.target.value)}
                                />
                            </div>

                            <div className={styles['form-group']}>
                                <label htmlFor="symptoms-input">Simptome:</label>
                                <input
                                    type="text"
                                    placeholder="scrieți răspunsul"
                                    required
                                    id="symptoms-input"
                                    value={currentSymptoms}
                                    onChange={(e) => setCurrentSymptoms(e.target.value)}
                                />
                            </div>

                            <div className={styles['form-group']}>
                                <label>Sunteți însărcinată?</label>
                                <div className={styles['boolean-group']}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="pregnancy"
                                            value="true"
                                            checked={pregnancy === true}
                                            onChange={() => setPregnancy(true)}
                                        />
                                        Da
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="pregnancy"
                                            value="false"
                                            checked={pregnancy === false}
                                            onChange={() => setPregnancy(false)}
                                        />
                                        Nu
                                    </label>
                                </div>
                            </div>

                            <button onClick={handleSaveAnamnesis} style={{ marginTop: '10px' }}>
                                Salvează Anamneza
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className={styles['form-group']}>
                                <label htmlFor="current-medication-input">Medicație curentă:</label>
                                <p>{currentMedication}</p>
                            </div>

                            <div className={styles['form-group']}>
                                <label htmlFor="recent-medication-input">Medicație recentă:</label>
                                <p>{recentMedication}</p>
                            </div>

                            <div className={styles['form-group']}>
                                <label htmlFor="symptoms-input">Simptome:</label>
                                <p>{currentSymptoms}</p>
                            </div>

                            <div className={styles['form-group']}>
                                <label>Sunteți însărcinată?</label>
                                <p>{pregnancy ? "da" : "nu"}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Adaugăm validarea prop-types pentru appointmentId
AppointmentAnamnesisForm.propTypes = {
    appointmentId: PropTypes.number.isRequired, // Asigură-te că tipul este corect
    appointmentReason: PropTypes.string.isRequired, // Adaugă validarea pentru prop-ul appointmentReason
};

export default AppointmentAnamnesisForm;
