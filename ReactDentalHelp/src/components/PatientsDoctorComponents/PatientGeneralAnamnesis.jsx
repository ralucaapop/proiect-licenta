import PatientPersonalData from "./PatientPersonalData.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import styles from "../../assets/css/GeneralAnamnesis.module.css";

function PatientGeneralAnamnesis(props){
    const [editOn, setEdit] = useState(false);
    const [allergies, setAllergies] = useState("");
    const [medicalIntolerance, setMedicalIntolerance] = useState("");
    const [previousDentalProblems, setPreviousDentalProblems] = useState("");
    const [alcohol, setAlcohol] = useState(null);
    const [smoke, setSmoke] = useState(null);
    const [coagulation, setCoagulation] = useState(null);
    const fetchPatientGeneralAnamnesis = async () => {
        try {
            console.log(props.cnp);

            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/in/general-anamnesis/get-general-anamnesis/${props.cnp}`, // Utilizează props.cnp direct
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data.data;
                console.log(data)
                setAllergies(data.allergies);
                setMedicalIntolerance(data.medicalIntolerance);
                setPreviousDentalProblems(data.previousDentalProblems);
                setAlcohol(data.alcoholConsumer);
                setSmoke(data.smoker);
                setCoagulation(data.coagulationProblems);
            }
        } catch (error) {
            console.error('Eroare la preluarea datelor personale', error);
        }
    };

    useEffect(() => {
        if (props.cnp) {
            resetGeneralAnamnesis(); // Resetează datele pacientului anterior
            fetchPatientGeneralAnamnesis(); // Reîncarcă datele pacientului curent
        }
    }, [props.cnp]); // Apelează useEffect când `props.cnp` se schimbă

    const resetGeneralAnamnesis = () => {
        setAllergies("");
        setMedicalIntolerance("");
        setPreviousDentalProblems("");
        setAlcohol("");
        setSmoke("");
        setCoagulation("");
    };

    const toggleEditMode = () => {
        setEdit((prevEdit) => !prevEdit);
    };

    const handleEditForm = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/in/general-anamnesis/update-general-anamnesis`,
                {
                    cnp: props.cnp, // Folosește direct props.cnp
                    allergies: allergies,
                    coagulation,
                    smoke,
                    alcohol,
                    previousDentalProblems:previousDentalProblems,
                    medicalIntolerance
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log('Datele au fost salvate cu succes.');
                setEdit(false);
                alert("Datele pacientului au fost modificate cu succes")
            }
        } catch (error) {
            console.error('Eroare la salvarea datelor', error);
        }
    };

    return(
      <div>
          <div className={styles.patientDataContainer}>
              <h1 className={styles.title}>Anamneza generala</h1>
              {/* Adăugăm un switch pentru a comuta între modurile de vizualizare și editare */}
              <div className={styles.switchContainer}>
                  <label htmlFor="edit-switch">Editează:</label>
                  <input
                      type="checkbox"
                      id="edit-switch"
                      checked={editOn}
                      onChange={toggleEditMode} // Functia care inverseaza starea editOn
                  />
              </div>
              {editOn ? (
                      <div>
                          <div className={styles['formGroup']}>
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

                          <div className={styles['formGroup']}>
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

                          <div className={styles['formGroup']}>
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

                          <div className={styles['formGroup']}>
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

                          <div className={styles['formGroup']}>
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

                          <div className={styles['formGroup']}>
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
                          <button onClick={handleEditForm} className={styles.buttonSave}>
                              Salvati datele
                          </button>
                      </div>
                  ) :
                  (
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
      </div>
    );
}

PatientPersonalData.defaultProps = {
    cnp: ""
};
export default PatientGeneralAnamnesis