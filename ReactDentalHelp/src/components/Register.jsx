import { useNavigate } from 'react-router-dom';
import styles from'../assets/css/register.module.css';
import manImage from '../assets/register_photo/man.png';
import womenImage from '../assets/register_photo/women.png';
import React, {useState} from "react";
import axios from "axios";
import VerificationCodeNewAccount from "./VerificationCodeNewAccount.jsx";
import NavBar from "./NavBar.jsx";
import {Box, Dialog, Modal} from "@mui/material";

function Register() {

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setSecondName] = useState("");
    const [cnp, setCnp] = useState("");
    const [password, setPassword] = useState("");
    const [reTypePassword, setRePassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [code, setCode] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorText, setErrorText] = useState("");
    const navigator = useNavigate();


    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        const patternForLetters = /.*[a-zA-Z].*/;
        const patternForDigit = /.*\d+.*/;
        const regexForEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Verifică adresa de email
        if (!regexForEmail.test(email)) {
            setShowErrorModal(true);
            setErrorText("Adresa de e-mail este invalidă");
            setErrorTitle("E-mail invalid");
            return;
        }

        // Verifică lungimea parolei
        if (password.length < 8) {
            setShowErrorModal(true);
            setErrorText("Parola trebuie să aibă cel puțin 8 caractere");
            setErrorTitle("Parolă invalidă");
            return;
        }

        // Verifică dacă parola conține cel puțin o cifră
        if (!patternForDigit.test(password)) {
            setShowErrorModal(true);
            setErrorText("Parola trebuie să conțină cel puțin o cifră");
            setErrorTitle("Parolă invalidă");
            return;
        }

        // Verifică dacă parola conține cel puțin o literă
        if (!patternForLetters.test(password)) {
            setShowErrorModal(true);
            setErrorText("Parola trebuie să conțină cel puțin o literă");
            setErrorTitle("Parolă invalidă");
            return;
        }

        // Verifică dacă parolele coincid
        if (password !== reTypePassword) {
            setShowErrorModal(true);
            setErrorText("Parolele nu coincid");
            setErrorTitle("Parolele nu coincid");
            return;
        }

        // Trimiterea cererii la server
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                email: email,
                firstName: firstName,
                lastName: lastName,
                cnp: cnp,
                password: password,
                reTypePassword: reTypePassword
            });

            if (response.status === 200) {
                console.log('Codul a fost trimis cu succes', response.data);
                setIsDialogOpen(true);
            } else {
                alert('Eroare la înregistrare: ' + response.statusText);
            }
        } catch (error) {
            console.error('Eroare de la server:', error.response ? error.response.data : error.message);
            setShowErrorModal(true);
            setErrorTitle("Eroare");
            if(error.response)
            {
                if(error.response.data.message==="Email already exists in db")
                    setErrorText('Există deja un cont creat cu această adresă de e-mail!');
                else if(error.response.data.message==="CNP already exists in db")
                    setErrorText('Există deja un cont creat care folosește acest CNP!');
                else if(error.response.data.message==="The CNP is invalid")
                    setErrorText('CNP-ul este invalid. Asigură-te că ai introdus corect datele');
            }
            else{
                setErrorText('Eroare la înregistrare: ' + (error.message));
            }
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false); // Închide dialogul
    };

    const handleDialogSubmit = async () => {
        console.log('Codul introdus:', code);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register/verification', {
                email: email,
                firstName: firstName,
                lastName: lastName,
                cnp: cnp,
                parent: null,
                password: password,
                verificationCode: code
            });

            if (response.status === 200) {
                console.log('Pacientul a fost inregistrat cu succes', response.data);
                setIsDialogOpen(false); // Închide dialogul după submit
                navigator('/Login');
            } else {
                alert('Eroare la înregistrare: ' + response.statusText);
            }
        } catch (error) {
            console.error('Eroare de la server:', error.response ? error.response.data : error.message);
            alert('Eroare la înregistrare: ' + (error.response ? error.response.data.message : error.message));
        }

    };
    const handleCloseErrorModal = () => setShowErrorModal(false);

    return (
        <div className={styles["page"]}>
            <NavBar></NavBar>
            <Modal open={showErrorModal} onClose={handleCloseErrorModal}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>{errorTitle}</h2>
                    <p className={styles.text}>{errorText}
                    </p>
                </Box>
            </Modal>
        <div className={styles["content"]}>
            <img src={manImage} className={styles["left-image-reg"]} alt="Man" />
            <div className={styles["card-content"]}>
                <h1 className={styles["helloMsg"]}>BINE AȚI VENIT</h1>
                <form onSubmit={handleRegisterSubmit}>
                            <div className={styles["form-group"]}>
                                <input placeholder="Nume" required id="register-firstName-input" value={firstName}
                                       onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div className={styles["form-group"]}>
                                <input placeholder="Prenume" required id="register-lastName-input" value={lastName}
                                       onChange={(e) => setSecondName(e.target.value)}/>
                            </div>
                            <div className={styles["form-group"]}>
                                <input placeholder="CNP" required id="register-cnp-input" value={cnp}
                                       onChange={(e) => setCnp(e.target.value)}/>
                            </div>
                            <div className={styles["form-group"]}>
                                <input placeholder="Adresa e-mail" required id="register-email-input" value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className={styles["form-group"]}>
                                <input type="password" placeholder="Parola" required id="register-password-input"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className={styles["form-group"]}>
                                <input type="password" placeholder="Repetă parola" required
                                       id="register-repassword-input" value={reTypePassword}
                                       onChange={(e) => setRePassword(e.target.value)}/>
                            </div>
                            <button type="submit" className={styles["btn"]}>Crează Cont</button>
                        </form>
                    </div>
            <img src={womenImage} className={styles["right-image-reg"]} alt="Woman" />
        </div>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <div className={styles["dialog-content"]}>
                    <h2 className={styles.dialogTitle}>Introduceți Codul de Verificare</h2>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Cod de verificare"
                    />
                    <button onClick={handleDialogSubmit}>Trimite</button>
                    <button onClick={handleDialogClose}>Anulează</button>
                </div>
            </Dialog>
        </div>
    );
}

export default Register;
