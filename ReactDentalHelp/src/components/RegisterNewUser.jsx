import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import styles from "../assets/css/RegisterNewUser.module.css";
import user_photo from "../assets/patients_photo/user.png";
import PatientPersonalData from "./PatientsDoctorComponents/PatientPersonalData.jsx";
import arrow from "../assets/icons/interaction.png"
import InfoBox from "./InfoBox.jsx";
import {Box, Dialog, Modal} from "@mui/material";


const RegisterNewUser = () =>{
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setSecondName] = useState("");
    const [cnp, setCnp] = useState("");
    const [password, setPassword] = useState("");
    const [reTypePassword, setRePassword] = useState("");
    const [userRole, setUserRole] = useState("");
    const navigator = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [patients, setPatients] = useState([]);
    const [radiologists, setRadiologists] = useState([])
    const [selectedPatientCnp, setSelectedPatientCnp] = useState(null);
    const [infoAddUserBoxVisible, setAddUserInfoBoxVisible] = useState(false);
    const [infoChangeRoleBoxVisible, setChangeRoleInfoBoxVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleArrowClick = () => {
        setShowModal(true);
    };

    const handleRegisterSubmit= async (e) =>{
        e.preventDefault();
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `http://localhost:8080/api/admin/patient/addPatient`,
                    {
                        firstName: firstName,
                        lastName: lastName,
                        cnp: cnp,
                        email: email,
                        parent: null,
                        userRole: userRole,
                        password: password
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setAddUserInfoBoxVisible(true);
                    setFirstName(null);
                    setSecondName(null);
                    setCnp(null);
                    setEmail(null);
                    setUserRole(null);
                    setPassword(null);
                }
            } catch (error) {
                setShowErrorMessage(true)
                setErrorMessage(error.response.data.message)
                console.error('Eroare la inregistrare', error.response.data.message);
            }
    } ;
    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/admin/patient/get-patients', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const patients = response.data.data.filter((patient)=>patient.userRole==="PATIENT")
            const radiologists = response.data.data.filter((patient)=>patient.userRole==="RADIOLOGIST")

            console.log(radiologists)
            setPatients(patients);
            setRadiologists(radiologists)
        } catch (error) {
            console.error('Error fetching patients', error);
        }
    };

    const handlePatientSelect = (cnp) => {
        setSelectedPatientCnp(cnp);
        console.log(cnp)
    };

    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const handleOpenQuestionModal = () => {
        setShowConfirmModal(true);
    };

    const handleChangeRole = async ()=>{
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/admin/patient/change-radiologist-to-patient/${selectedPatientCnp}`,{

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChangeRoleInfoBoxVisible(true)
                fetchPatients()
                handleCloseModal()
                setShowConfirmModal(false)
                setSelectedPatientCnp(null)
            }
        } catch (error) {
            console.error('Eroare la schimbare', error);
        }
    }

    useEffect(() => {
        fetchPatients();
    }, []);

    const closeInfoAddUserBox = () => {
        setAddUserInfoBoxVisible(false);
    };

    const closeInfoChangeUserRoleBox = () => {
        setChangeRoleInfoBoxVisible(false);
    };

    const closeErrorMessageBox = () => {
        setErrorMessage("");
        setShowErrorMessage(false)
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.contentPage}>
            {infoAddUserBoxVisible && <InfoBox message={"Utilizatorul a fost adaugat cu succes."} onClose={closeInfoAddUserBox}/>}
            {infoChangeRoleBoxVisible && <InfoBox message={"Rolul utilizatoruli a fost schimbat cu succes."} onClose={closeInfoChangeUserRoleBox}/>}
            {showErrorMessage && <InfoBox message={errorMessage} onClose={closeErrorMessageBox}/>}

            <div className={styles.users}>
                <div className={styles.usersVertical}>
                    <div className={styles.tabButtons}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 0 ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(0)}
                        >Radiologi
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 1 ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(1)}
                        >Pacienti
                        </button>
                    </div>
                    { activeTab === 1?(
                    <div className={styles.patientList}>
                        {patients.map((patient) => (
                            <div
                                key={patient.id}
                                className={`${styles.patientCard} ${selectedPatientCnp === patient.cnp ? styles.selectedPatient : ''}`}
                                onClick={() => handlePatientSelect(patient.cnp)}
                            >
                                <img
                                    src={user_photo}
                                    alt={`${patient.firstName} ${patient.lastName}`}
                                    className={styles.patientPhoto}
                                />
                                <p>{`${patient.firstName} ${patient.lastName}`} <br/> {`(${patient.cnp})`}</p>
                            </div>
                        ))}
                    </div>
                    ): (
                        <div className={styles.patientList}>
                            {radiologists.map((patient) => (
                                <div
                                    key={patient.id}
                                    className={`${styles.patientCard} ${selectedPatientCnp === patient.cnp ? styles.selectedPatient : ''}`}
                                    onClick={() => handlePatientSelect(patient.cnp)}
                                >
                                    <img
                                        src={user_photo}
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        className={styles.patientPhoto}
                                    />
                                    <p>{`${patient.firstName} ${patient.lastName}`} <br/> {`(${patient.cnp})`}</p>
                                    <img
                                        src={arrow}
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        className={styles.changeRolImg}
                                        onClick={() =>handleArrowClick(patient.cnp)}
                                    />
                                </div>
                            ))}

                            <Modal open={showModal} onClose={handleCloseModal}>
                                <Box className={styles.box}>
                                    <h2 className={styles.changeRolT}>Schimbare Rol Utilizator</h2>
                                    <p className={styles.text}>
                                        Poți schimba rolul unui radiolog în pacient apăsând butonul de mai jos.
                                    </p>
                                    <button className={styles.actionButton} onClick={handleOpenQuestionModal}>
                                        Schimbă rol
                                    </button>
                                    <button onClick={handleCloseModal}>Închide</button>
                                </Box>
                            </Modal>

                            <Modal open={showConfirmModal} onClose={handleCloseConfirmModal}>
                                <Box className={styles.box}>
                                    <h2 className={styles.changeRolT}>Confirmare</h2>
                                    <p className={styles.text}>
                                        Ești sigur că dorești să schimbi rolul acestui utilizator?
                                    </p>
                                    <button className={styles.actionButton} onClick={()=>handleChangeRole()}>
                                        Da, schimbă rolul
                                    </button>
                                    <button onClick={handleCloseConfirmModal}>Anulează</button>
                                </Box>
                            </Modal>

                        </div>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <PatientPersonalData cnp={selectedPatientCnp}/>
                </div>
            </div>
            <div className={styles["card-content"]}>
                <p className={styles.registerNewUserT}>Întregistrați un utilizator</p>
                <form className={styles.form} onSubmit={handleRegisterSubmit}>
                    <input className={styles["form-group"]} placeholder="Nume" required id="register-firstName-input" value={firstName}
                               onChange={(e) => setFirstName(e.target.value)}/>

                    <input className={styles["form-group"]} placeholder="Prenume" required id="register-lastName-input" value={lastName}
                               onChange={(e) => setSecondName(e.target.value)}/>
                    <input className={styles["form-group"]} placeholder="CNP" required id="register-cnp-input" value={cnp}
                           onChange={(e) => setCnp(e.target.value)}/>
                    <input className={styles["form-group"]} placeholder="Adresa e-mail" required id="register-email-input" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                    <input className={styles["form-group"]} type="password" placeholder="Parola" required id="register-password-input"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>

                <div className={styles["boolean-group"]}>
                    <label>Rolul Utilizatorului:</label>
                    <label className={styles.user_role_label}>
                        <input type="radio" name="userRole" value="PATIENT" checked={userRole === "PATIENT"}
                               onChange={() => setUserRole("PATIENT")}/> Pacient
                    </label>
                    <label className={styles.user_role_label}>
                        <input type="radio" name="userRole" value="RADIOLOGIST" checked={userRole === "RADIOLOGIST"}
                               onChange={() => setUserRole("RADIOLOGIST")}/> Radiolog
                    </label>
                </div>
                <button type="submit" className="btn">Crează Cont</button>
            </form>
        </div>
        </div>
    )
}

export default RegisterNewUser