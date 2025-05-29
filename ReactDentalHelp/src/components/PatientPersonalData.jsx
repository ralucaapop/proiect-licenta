import styles from "../assets/css/PatientPersonalData.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseJwt } from "../service/authService.jsx";
import { AiOutlineInfoCircle, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import NavBar from "./NavBar.jsx";
import {Box, Modal} from "@mui/material";

function PatientPersonalData() {
    const [addressStreet, setAddressStreet] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressCountry, setAddressCountry] = useState("");
    const [addressRegion, setAddressRegion] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [sex, setSex] = useState("");
    const [dataExists, setDataExists] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(true);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoTitle, setInfoTitle] = useState("");
    const [infoText, setInfoText] = useState("");

    const token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);

    const baseUrl = import.meta.env.VITE_BACKEND_URL;


    const handleCloseInfoMdal = ()=>{
        setShowInfoModal(false);
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(
                baseUrl+`/api/in/personalData/get-patient-personal-data/${decodedToken.cnp}`,
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
                ? baseUrl+"/api/in/personalData/update-personal-data"
                : baseUrl+"/api/in/personalData/add-personal-data";
            const method = dataExists ? "put" : "post";

            const response = await axios({
                method: method,
                url: url,
                data: requestData,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 201) {
                setShowInfoModal(true)
                if(dataExists)
                setInfoText("Datele au fost actualizate cu succes")
                else{
                    setInfoText("Datele au fost salvate cu succes")
                }
                fetchData();
                setIsEditing(false);
            } else {
                setShowInfoModal(true)
                setInfoText("Eroare la salvarea datelor: " + response.statusText);
            }
        } catch (error) {
            console.error("Eroare de la server:", error.response ? error.response.data : error.message);
            setShowInfoModal(true)
            if(error.response)
            setInfoText("Eroare la salvarea datelor: " + error.response.data.message);
            else{
                setInfoText("Eroare la salvarea datelor: " + error.message);
            }
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
        <div className={styles.page}>
            <NavBar></NavBar>
            <Modal open={showInfoModal} onClose={handleCloseInfoMdal}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>{infoTitle}</h2>
                    <p className={styles.text}>{infoText}
                    </p>
                </Box>
            </Modal>
            <div className={styles.patientDataContainer}>
                <p className={styles.title}>Date Personale</p>
                <div className={styles.infoContainer}>
                    <p className={styles.infoMessage}>
                        <AiOutlineInfoCircle /> Completați informațiile cât mai exact pentru o comunicare eficientă.
                    </p>
                </div>

                <div className={styles.actionButtons}>
                    {dataExists ? (
                        <>
                            <button onClick={handleView} className={styles.buttonView}>
                                Vizualizare Date
                            </button>
                            <button onClick={handleEdit} className={styles.buttonEdit}>
                                 Editare Date
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className={styles.buttonEdit}>
                            Completare Date
                        </button>
                    )}
                </div>

                {isEditing && (
                    <form onSubmit={handleFormSubmit} className={styles.formM}>
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="street">Strada:</label>
                                <input type="text" id="street" className={styles.input} value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="number">Număr:</label>
                                <input type="text" id="number" className={styles.input} value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="region">Localitate:</label>
                                <input type="text" id="region" className={styles.input} value={addressRegion} onChange={(e) => setAddressRegion(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="country">Județ:</label>
                                <input type="text" id="country" className={styles.input} value={addressCountry} onChange={(e) => setAddressCountry(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="phone">Telefon:</label>
                                <input type="text" id="phone" className={styles.input} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                            </div>

                            <div className={styles["boolean-group"]}>
                                <label className={styles.label}>Gen:</label>
                                <div className={styles.labels}>
                                    <label className={styles.sex_label}>
                                        <input type="radio" name="sex" value="male" checked={sex === "male"} onChange={() => setSex("male")} /> Masculin
                                    </label>
                                    <label className={styles.sex_label}>
                                        <input type="radio" name="sex" value="female" checked={sex === "female"}
                                               onChange={() => setSex("female")}/> Feminin
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className={styles.buttonSave}>
                            {dataExists ? "Salvează Modificările" : "Salvează Datele"}
                        </button>
                    </form>
                )}

                {isViewing && dataExists && (
                    <div className={styles.dataView}>
                        <p className={styles.subTitle}>ADRESA</p>
                        <p><strong>Strada:</strong> {addressStreet}</p>
                        <p><strong>Număr:</strong> {addressNumber}</p>
                        <p><strong>Localitate:</strong> {addressRegion}</p>
                        <p><strong>Județ:</strong> {addressCountry}</p>
                        <p className={styles.subTitle}>CONTACT</p>
                        <p><strong>Telefon:</strong> {phoneNumber}</p>
                        <p><strong>Gen:</strong> {sex === "male" ? "Masculin" :sex === "female" ? "Feminin" : ""}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientPersonalData;
