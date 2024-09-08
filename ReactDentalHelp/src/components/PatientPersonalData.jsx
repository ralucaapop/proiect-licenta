import styles from "../assets/css/PatientPersonalData.module.css";
import {useState} from "react";
import axios from "axios";

function PatientPersonalData(){

    const [addressStreet, setAddressStreet] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressCountry, setAddressCountry] = useState("");
    const [addressRegion, setAddressRegion] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [sex, setSex] = useState("Female");
    const handleFormSubmit = async (e) =>{
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                "http://localhost:8080/api/in/personalData",
                {
                    addressStreet: addressStreet,
                    addressNumber: addressNumber,
                    addressCountry: addressCountry,
                    addressRegion: addressRegion,
                    phoneNumber: phoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Trimite token-ul JWT în header-ul Authorization
                    },
                }
            );

            if (response.status === 200) {
                console.log(
                    "Datele personale au fost salvate cu succes",
                    response.data
                );
            } else {
                alert("Eroare la salvarea datelor personale: " + response.statusText);
            }
        } catch (error) {
            console.error(
                "Eroare de la server:",
                error.response ? error.response.data : error.message
            );
            alert(
                "Eroare la salvarea datelor personale ale pacientului: " +
                (error.response ? error.response.data.message : error.message)
            );
        }

    }


    return(
        <div className={styles.anamnesisForm}>
            <h1 className={styles.title}>Date personale</h1>

            <div className={styles['form-group']}>
                <label htmlFor="street-input">Strada:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="Strada-input"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="number-input">Nr:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="number-input"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="region-input">Localitatea:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="region-input"
                    value={addressRegion}
                    onChange={(e) => setAddressRegion(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="country-input">Judet:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="country-input"
                    value={addressCountry}
                    onChange={(e) => setAddressCountry(e.target.value)}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="phone-number-input">Nr. Tel:</label>
                <input
                    type="text"
                    placeholder="scrieti raspunsul"
                    required
                    id="phone-number-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>


            <div className={styles['form-group']}>
                <label>Gen</label>
                <div className={styles['boolean-group']}>
                    <label>
                        <input
                            type="radio"
                            name="sex"
                            value="M"
                            checked={sex === "male"}
                            onChange={() => setSex("male")}
                        />
                        M
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sex"
                            value="F"
                            checked={sex === "female"}
                            onChange={() => setSex("female")}
                        />
                        F
                    </label>
                </div>
            </div>

            <button onClick={handleFormSubmit} className={styles.buttonSubmit}>
                Salvati datele
            </button>
        </div>
    );
}

export default PatientPersonalData;