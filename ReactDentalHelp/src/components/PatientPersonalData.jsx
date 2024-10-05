import styles from "../assets/css/PatientPersonalData.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { parseJwt } from "../service/authService.jsx";

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

    // Functia pentru a verifica dacă există date deja salvate pentru pacient
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/in/personalData/get-patient-personal-data/${decodedToken.cnp}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 && response.data.data) {
                setAddressStreet(response.data.data.addressStreet);
                setAddressNumber(response.data.data.addressNumber);
                setAddressCountry(response.data.data.addressCountry);
                setAddressRegion(response.data.data.addressRegion);
                setPhoneNumber(response.data.data.phoneNumber);
                setSex(response.data.data.sex);
                setDataExists(true); // Există date, deci vom permite editarea
            }
        } catch (error) {
            console.error("Eroare la obținerea datelor: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Functia de salvare pentru completare și editare
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const requestData = {
            addressStreet,
            addressNumber,
            addressCountry,
            addressRegion,
            phoneNumber,
            cnpPatient: decodedToken.cnp,
            sex,
        };
        try {
            const url = dataExists
                ? "http://localhost:8080/api/in/personalData/update-personal-data"
                : "http://localhost:8080/api/in/personalData/add-personal-data";
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
                alert(dataExists ? "Datele au fost actualizate cu succes" : "Datele au fost salvate cu succes");
                fetchData();
                setIsEditing(false); // După salvare, ieșim din modul de editare
            } else {
                alert("Eroare la salvarea/actualizarea datelor personale: " + response.statusText);
            }
        } catch (error) {
            console.error("Eroare de la server:", error.response ? error.response.data : error.message);
            alert("Eroare la salvarea datelor personale: " + (error.response ? error.response.data.message : error.message));
        }
    };

    // Funcția de vizualizare a datelor
    const handleView = () => {
        setIsViewing(true);
        setIsEditing(false);
    };

    // Funcția pentru a începe editarea datelor
    const handleEdit = () => {
        setIsEditing(true);
        setIsViewing(false);
    };

    return (
        <div className={styles.anamnesisForm}>
            <h1 className={styles.title}>Date personale</h1>

            {/* Afisam butoanele pentru fiecare actiune */}
            <div className={styles.actionButtons}>
                {dataExists ? (
                    <>
                        <button onClick={handleView} className={styles.buttonSubmit}>
                            Vizualizare date
                        </button>
                        <button onClick={handleEdit} className={styles.buttonSubmit}>
                            Editare date
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className={styles.buttonSubmit}>
                        Completare date
                    </button>
                )}
            </div>

            {/* Form pentru editare sau completare */}
            {isEditing && (
                <form onSubmit={handleFormSubmit}>
                    <div className={styles["form-group"]}>
                        <h2>Adresa</h2>
                        <label htmlFor="street-input">Strada:</label>
                        <input
                            type="text"
                            placeholder="scrieti raspunsul"
                            required
                            id="street-input"
                            value={addressStreet}
                            onChange={(e) => setAddressStreet(e.target.value)}
                        />
                    </div>

                    <div className={styles["form-group"]}>
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

                    <div className={styles["form-group"]}>
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

                    <div className={styles["form-group"]}>
                        <label htmlFor="country-input">Județ:</label>
                        <input
                            type="text"
                            placeholder="scrieti raspunsul"
                            required
                            id="country-input"
                            value={addressCountry}
                            onChange={(e) => setAddressCountry(e.target.value)}
                        />
                    </div>

                    <div className={styles["form-group"]}>
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

                    <div className={styles["form-group"]}>
                        <label>Gen:</label>
                        <div className={styles["boolean-group"]}>
                            <label>
                                <input
                                    type="radio"
                                    name="sex"
                                    value="male"
                                    checked={sex === "male"}
                                    onChange={() => setSex("male")}
                                />
                                M
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="sex"
                                    value="female"
                                    checked={sex === "female"}
                                    onChange={() => setSex("female")}
                                />
                                F
                            </label>
                        </div>
                    </div>

                    <button type="submit" className={styles.buttonSubmit}>
                        {dataExists ? "Salvează modificările" : "Salvează datele"}
                    </button>
                </form>
            )}

            {/* Vizualizarea datelor */}
            {isViewing && dataExists && (
                <div className={styles.dataView}>
                    <h2>ADRESA</h2>
                    <p><strong>Strada:</strong> {addressStreet}</p>
                    <p><strong>Nr:</strong> {addressNumber}</p>
                    <p><strong>Localitatea:</strong> {addressRegion}</p>
                    <p><strong>Județ:</strong> {addressCountry}</p>
                    <h3>CONTACT</h3>
                    <p><strong>Nr. Tel:</strong> {phoneNumber}</p>
                    <p><strong>Gen:</strong> {sex === "male" ? "M" : "F"}</p>
                </div>
            )}
        </div>
    );
}

export default PatientPersonalData;
