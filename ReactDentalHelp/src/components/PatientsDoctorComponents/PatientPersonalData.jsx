import { useEffect, useState } from "react";
import styles from "../../assets/css/PatientPersonalData.module.css";
import axios from "axios";

function PatientPersonalData(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [addressStreet, setAddressStreet] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressCountry, setAddressCountry] = useState("");
    const [addressRegion, setAddressRegion] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dob, setDob] = useState("");
    const [age, setAge] = useState("");
    const [editOn, setEdit] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");

    // Functia pentru toggle edit mode
    const toggleEditMode = () => {
        setEdit((prevEdit) => !prevEdit);
    };

    // Fetch patient data from the API
    const fetchPatientPersonalData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/admin/patient/get-patient-persoanl-data/${props.cnp}`, // Utilizează props.cnp direct
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data.data;
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setAddressStreet(data.addressStreet);
                setAddressNumber(data.addressNumber);
                setAddressCountry(data.addressCountry);
                setAddressRegion(data.addressRegion);
                setPhoneNumber(data.phoneNumber);
                setDob(data.dob);
                setAge(data.age);
                setEmailAddress(data.email);
            }
        } catch (error) {
            console.error('Eroare la preluarea datelor personale', error);
        }
    };

    // Resetare stare la schimbarea pacientului
    const resetPatientData = () => {
        setFirstName("");
        setLastName("");
        setAddressStreet("");
        setAddressNumber("");
        setAddressCountry("");
        setAddressRegion("");
        setPhoneNumber("");
        setDob("");
        setAge("");
        setEmailAddress("");
    };

    useEffect(() => {
        if (props.cnp) {
            resetPatientData(); // Resetează datele pacientului anterior
            fetchPatientPersonalData(); // Reîncarcă datele pacientului curent
        }
    }, [props.cnp]); // Apelează useEffect când `props.cnp` se schimbă

    const handleEditForm = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/in/personalData/update-personal-data`,
                {
                    cnpPatient: props.cnp, // Folosește direct props.cnp
                    addressCountry: addressCountry,
                    addressRegion: addressRegion,
                    addressNumber: addressNumber,
                    addressStreet: addressStreet,
                    phoneNumber: phoneNumber,
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

    return (
        <div className={styles.anamnesisForm}>
            <h1 className={styles.title}>Date personale</h1>

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

                    <button onClick={handleEditForm} className={styles.buttonSubmit}>
                        Salvati datele
                    </button>
                </div>
            ) : (
                <div>
                    <div className={styles['form-group']}>
                        <label>Prenume:</label>
                        <p>{firstName}</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label>Nume:</label>
                        <p>{lastName}</p>
                    </div>
                    <div className={styles['form-group']}>
                        <label>Data nasterii:</label>
                        <p>{dob}</p>
                    </div>
                    <div className={styles['form-group']}>
                        <label>Varsta:</label>
                        <p>{age}</p>
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="street-input">Strada:</label>
                        <p>{addressStreet}</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="number-input">Nr:</label>
                        <p>{addressNumber}</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="region-input">Localitatea:</label>
                        <p>{addressRegion}</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="country-input">Judet:</label>
                        <p>{addressCountry}</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="phone-number-input">Nr. Tel:</label>
                        <p>{phoneNumber}</p>
                    </div>
                    <div className={styles['form-group']}>
                        <label>E-mail address:</label>
                        <p>{emailAddress}</p>
                    </div>

                </div>
            )}
        </div>
    );
}

PatientPersonalData.defaultProps = {
    cnp: ""
};
export default PatientPersonalData;
