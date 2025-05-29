import PatientPersonalData from "./PatientPersonalData.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Modal, TextField} from "@mui/material";
import styles from "../assets/css/RegisterNewUser.module.css";
import InfoBox from "./InfoBox.jsx";

function ChangeKidAccount({cnpKid, onRoleChangeSuccess }){

    const [infoChangeRoleBoxVisible, setChangeRoleInfoBoxVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const [emailKid, setEmailKid] = useState("");
    const [emailError, setEmailError] = useState(false);

    const baseUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {

    }, []); // Apelează useEffect când `props.cnp` se schimbă


    const handleChangeRole = async ()=>{
        if (!emailKid.trim()) {
            setEmailError(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                baseUrl+`/api/admin/patient/change/kid-to-patient/${cnpKid}/${emailKid}`,{

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChangeRoleInfoBoxVisible(true);

                setTimeout(() => {
                    onRoleChangeSuccess();
                }, 3000);
            }

        } catch (error) {
            setErrorMessage(true);
            console.error('Eroare la schimbare', error.response.data.message);
        }
    }

    const closeInfoChangeUserRoleBox = () => {
        setChangeRoleInfoBoxVisible(false);
    };

    const closeErrorMessage = () => {
        setErrorMessage(false);
    };

    return(

            <div className={styles.alignCenter}>
                {infoChangeRoleBoxVisible && <InfoBox message={"Contul a fost migrat."} onClose={closeInfoChangeUserRoleBox}/>}
                {errorMessage && <InfoBox message={"Acest email aparține deja unui utilizator."} onClose={closeErrorMessage}/>}

                <p className={styles.text}>
                    Sunteți sigur/ă că doriți să migrați spre un cont individual pentru copilul selectat?<br/>Parola noului cont reprezintă CNP-ul copilui, aceasta poate fi schimbată ulterior.
                </p>

                <TextField
                    label="Email copil"
                    variant="outlined"
                    fullWidth
                    required
                    value={emailKid}
                    error={emailError}
                    helperText={emailError ? "Emailul este obligatoriu" : ""}
                    onChange={(e) => setEmailKid(e.target.value)}
                    style={{ marginBottom: "1rem", maxWidth: "300px" }}
                />
                <button className={styles.actionButton} onClick={()=>handleChangeRole()}>
                    Da, migrează!
                </button>
            </div>

    );
}


export default ChangeKidAccount