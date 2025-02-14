import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import styles from "../assets/css/RegisterNewUser.module.css";
import user_photo from "../assets/patients_photo/user.png";
import PatientPersonalData from "./PatientsDoctorComponents/PatientPersonalData.jsx";
import arrow from "../assets/icons/arrow-right.png"


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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleArrowClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                    alert("Inregistrare reusita");
                }
            } catch (error) {
                console.error('Eroare la inregistrare', error);
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
                alert("Schimbare reusita");
                fetchPatients()
                handleCloseModal()
                setSelectedPatientCnp(null)
            }
        } catch (error) {
            console.error('Eroare la schimbare', error);
        }
    }

    useEffect(() => {
        fetchPatients();
    }, []);


    return (
        <div className={styles.contentPage}>

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
                                        className={styles.patientPhoto}
                                        onClick={() =>handleArrowClick(patient.cnp)}
                                    />
                                </div>
                            ))}
                            {isModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h2>Schimbare Rol Utilizator</h2>
                                        <p>Poți schimba rolul unui radiolog în pacient apăsând butonul de mai jos.</p>
                                        <button onClick={handleChangeRole}>Schimba rol</button>
                                        <button onClick={handleCloseModal}>Inchide</button>

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <PatientPersonalData cnp={selectedPatientCnp}/>
                </div>
            </div>
            <div className={styles["card-content"]}>
                <h2 className={styles.registerNewUserT}>Intregistrați un utilizator</h2>
                <form onSubmit={handleRegisterSubmit}>
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