import styles from "../assets/css/HandleKidAccount.module.css";
import kid_img from "../assets/kids_photos/13.png";
import user_photo from "../assets/patients_photo/user.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { parseJwt } from "../service/authService.jsx";

// Importăm componentele din Material-UI
import { Modal, Box, Button, TextField } from "@mui/material";
import PatientPersonalData from "./PatientsDoctorComponents/PatientPersonalData.jsx";
import PatientGeneralAnamnesis from "./PatientsDoctorComponents/PatientGeneralAnamnesis.jsx";
import PatientAppointmentsForDoctor from "./PatientsDoctorComponents/PatientAppointmentsForDoctor.jsx";
import PatientRadiography from "./PatientsDoctorComponents/PatientRadiography.jsx";
import PatientStatus from "./PatientsDoctorComponents/PatientStatus.jsx";
import RequestAppointment from "./RequestAppointment.jsx";
import RequestAppointmentKid from "./RequestAppointmentKid.jsx";

function HandleKidAccount() {
    const [kids, setKids] = useState([]);
    const [selectedKidCnp, setSelectedKidCnp] = useState(null);
    const [showModal, setShowModal] = useState(false); // Pentru a controla deschiderea/închiderea modalului
    const [newKidData, setNewKidData] = useState({ firstName: "", lastName: "", cnp: "" }); // Datele noului copil
    const [activeTab, setActiveTab] = useState(0); // 0 pentru prima componentă, 1 pentru a doua, etc.

    // Fetch copii din API
    const fetchPatients = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = parseJwt(token);
        const cnp = decodedToken.cnp;

        try {
            const token = localStorage.getItem('token'); // assuming you store the token in localStorage
            const response = await axios.get(`http://localhost:8080/api/admin/patient/get-kids/${cnp}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKids(response.data.data); // Assuming response.data contains an array of patients
            console.log(response.data.data)
        } catch (error) {
            console.error('Error fetching patients', error);
        }

    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Funcția de selectare a unui copil
    const handleKidSelect = (cnp) => {
        setSelectedKidCnp(cnp);  // Selectăm copilul după CNP
    };

    // Funcția pentru a deschide modalul
    const handleAddKidClick = () => {
        setShowModal(true);
    };

    // Funcția pentru a închide modalul
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Funcția pentru a actualiza valorile din formular
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewKidData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRegisterKid = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token')
        const decodedToken = parseJwt(token)
        const parentCnp = decodedToken.cnp

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register/kid', {
                firstName: newKidData.firstName,
                lastName: newKidData.lastName,
                cnp: newKidData.cnp,
                parent: parentCnp
            });

            if (response.status === 200) {
                console.log('Kid added with success', response.data);
                handleCloseModal()
                alert("Intregistrare cu succes")
                setNewKidData({firstName: "", lastName: "", cnp: ""})
                fetchPatients()
            } else {
                alert('Eroare la înregistrare: ' + response.statusText);
            }
        } catch (error) {
            console.error('Eroare de la server:', error.response ? error.response.data : error.message);
            alert('Eroare la înregistrare: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const selectedKid = kids.find((kid) => kid.cnp === selectedKidCnp);

    // Stiluri pentru modal
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
    };

    const renderTabContent = () => {
        if (!selectedKidCnp) {
            return <p>Selectează un pacient pentru a vedea detaliile acestuia.</p>;
        }

        switch (activeTab) {
            case 0:
                return <PatientPersonalData cnp={selectedKidCnp} />;
            case 1:
                return <PatientGeneralAnamnesis cnp={selectedKidCnp} />;
            case 2:
                return <PatientAppointmentsForDoctor cnp={selectedKidCnp} />;
            case 3:
                return <PatientRadiography cnp={selectedKidCnp} />;
            case 4:
                return <PatientStatus cnp={selectedKidCnp} />;
            case 5:
                return <RequestAppointmentKid cnpProp={selectedKidCnp} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <div className={styles["left-side"]}>
                    <h1 className={styles["title"]}>Hai cu copilul la stomatolog</h1>
                    <p className={styles["text1"]}>
                        Programați copilul la medicul stomatolog și supravegheați-i evoluția dentară.
                    </p>
                    <p className={styles["text2"]}>
                        Acesta poate oricând să migreze către un cont independent și să își păstreze întreg istoricul medical.
                    </p>
                    <button className={styles["add-new-kid-btn"]} onClick={handleAddKidClick}>
                        Adăugați un copil
                    </button>
                    <img className={styles["img"]} src={kid_img} alt="kid" />
                </div>

                <div className={styles["right-side"]}>
                    <div className={styles["content-container"]}>
                        <div className={styles.kidsList}>
                            <h3>Copiii</h3>
                            {kids.length > 0 ? (
                                kids.map((kid) => (
                                    <div
                                        key={kid.id}
                                        className={`${styles.kidCard} ${
                                            selectedKidCnp === kid.cnp ? styles.selectedPatient : ""
                                        }`}
                                        onClick={() => handleKidSelect(kid.cnp)}
                                    >
                                        <p>{`${kid.firstName} ${kid.lastName}`}</p>
                                    </div>
                                ))
                            ) : (
                                <div className={styles["no-kids"]}>
                                    <p>Nu aveți copii adăugați.</p>
                                </div>
                            )}
                        </div>

                        <div className={styles["kid-details"]}>
                            {selectedKid ? (
                                <div>
                                    <div className={styles.tabButtons}>
                                        <button
                                            className={`${styles.tabButton} ${activeTab === 5 ? styles.activeTab : ''}`}
                                            onClick={() => setActiveTab(5)}
                                        >Cere programare
                                        </button>
                                        <button
                                            className={`${styles.tabButton} ${activeTab === 0 ? styles.activeTab : ''}`}
                                            onClick={() => setActiveTab(0)}
                                        >Date personale
                                        </button>
                                        <button
                                            className={`${styles.tabButton} ${activeTab === 1 ? styles.activeTab : ''}`}
                                            onClick={() => setActiveTab(1)}
                                        >Anamneza generala
                                        </button>
                                        <button
                                            className={`${styles.tabButton} ${activeTab === 2 ? styles.activeTab : ''}`}
                                            onClick={() => setActiveTab(2)}
                                        >Programările pacientului
                                        </button>
                                        <button
                                            className={`${styles.tabButton} ${activeTab === 3 ? styles.activeTab : ''}`}
                                            onClick={() => setActiveTab(3)}
                                        >Radiografii
                                        </button>
                                        <button
                                            className={`${styles.tabButton} ${activeTab === 4 ? styles.activeTab : ''}`}
                                            onClick={() => setActiveTab(4)}
                                        >Status
                                        </button>
                                    </div>
                                    <div className={styles.tabContent}>
                                        {renderTabContent()}
                                    </div>
                                </div>

                            ) : (
                                <div className={styles["no-selection"]}>
                                    <h2>Selectați un copil</h2>
                                    <p>Alegeți un copil din lista din dreapta pentru a vizualiza detalii și opțiuni.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={showModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <h2>Adăugați un copil</h2>
                    <TextField
                        label="Nume"
                        variant="outlined"
                        name="firstName"
                        fullWidth
                        margin="normal"
                        value={newKidData.firstName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Prenume"
                        variant="outlined"
                        name="lastName"
                        fullWidth
                        margin="normal"
                        value={newKidData.lastName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="CNP"
                        variant="outlined"
                        name="cnp"
                        fullWidth
                        margin="normal"
                        value={newKidData.cnp}
                        onChange={handleInputChange}
                    />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleRegisterKid}>
                            Adaugă copilul
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                            Anulează
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default HandleKidAccount;
