import styles from "../assets/css/PatientPersonalData.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { parseJwt } from "../service/authService.jsx";
import { AiOutlineInfoCircle, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { FaEye } from "react-icons/fa";

function PatientPersonalData() {
    const [addressStreet, setAddressStreet] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressCountry, setAddressCountry] = useState("");
    const [addressRegion, setAddressRegion] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [sex, setSex] = useState("female");
    const [dataExists, setDataExists] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(true);

    const token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/in/personalData/get-patient-personal-data/${decodedToken.cnp}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200 && response.data.data) {
                setAddressStreet(response.data.data.addressStreet);
                setAddressNumber(response.data.data.addressNumber);
                setAddressCountry(response.data.data.addressCountry);
                setAddressRegion(response.data.data.addressRegion);
                setPhoneNumber(response.data.data.phoneNumber);
                setSex(response.data.data.sex);
                setDataExists(true);
            }
        } catch (error) {
            console.error("Eroare la obținerea datelor:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const requestData = { addressStreet, addressNumber, addressCountry, addressRegion, phoneNumber, cnpPatient: decodedToken.cnp, sex };
        try {
            const url = dataExists
                ? "http://localhost:8080/api/in/personalData/update-personal-data"
                : "http://localhost:8080/api/in/personalData/add-personal-data";
            const method = dataExists ? "put" : "post";

            const response = await axios({
                method: method,
                url: url,
                data: requestData,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 201) {
                alert(dataExists ? "Datele au fost actualizate cu succes" : "Datele au fost salvate cu succes");
                fetchData();
                setIsEditing(false);
            } else {
                alert("Eroare la salvarea datelor: " + response.statusText);
            }
        } catch (error) {
            console.error("Eroare de la server:", error.response ? error.response.data : error.message);
            alert("Eroare la salvarea datelor: " + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleView = () => {
        setIsViewing(true);
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsViewing(false);
    };

    return (
        <div className={styles.patientDataContainer}>
            <h1 className={styles.title}>Date Personale</h1>
            <div className={styles.infoContainer}>
                <p className={styles.infoMessage}>
                    <AiOutlineInfoCircle /> Completați informațiile cât mai exact pentru o comunicare eficientă.
                </p>
            </div>

            <div className={styles.actionButtons}>
                {dataExists ? (
                    <>
                        <button onClick={handleView} className={styles.buttonView}>
                            <FaEye /> Vizualizare Date
                        </button>
                        <button onClick={handleEdit} className={styles.buttonEdit}>
                            <AiOutlineEdit /> Editare Date
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className={styles.buttonEdit}>
                        Completare Date
                    </button>
                )}
            </div>

            {isEditing && (
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="street">Strada:</label>
                        <input type="text" id="street" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="number">Număr:</label>
                        <input type="text" id="number" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="region">Localitate:</label>
                        <input type="text" id="region" value={addressRegion} onChange={(e) => setAddressRegion(e.target.value)} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="country">Județ:</label>
                        <input type="text" id="country" value={addressCountry} onChange={(e) => setAddressCountry(e.target.value)} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Telefon:</label>
                        <input type="text" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Gen:</label>
                        <label>
                            <input type="radio" name="sex" value="male" checked={sex === "male"} onChange={() => setSex("male")} /> Masculin
                        </label>
                        <label>
                            <input type="radio" name="sex" value="female" checked={sex === "female"} onChange={() => setSex("female")} /> Feminin
                        </label>
                    </div>

                    <button type="submit" className={styles.buttonSave}>
                        <AiOutlineSave /> {dataExists ? "Salvează Modificările" : "Salvează Datele"}
                    </button>
                </form>
            )}

            {isViewing && dataExists && (
                <div className={styles.dataView}>
                    <h2>ADRESA</h2>
                    <p><strong>Strada:</strong> {addressStreet}</p>
                    <p><strong>Număr:</strong> {addressNumber}</p>
                    <p><strong>Localitate:</strong> {addressRegion}</p>
                    <p><strong>Județ:</strong> {addressCountry}</p>
                    <h3>CONTACT</h3>
                    <p><strong>Telefon:</strong> {phoneNumber}</p>
                    <p><strong>Gen:</strong> {sex === "male" ? "Masculin" : "Feminin"}</p>
                </div>
            )}
        </div>
    );
}

export default PatientPersonalData;
