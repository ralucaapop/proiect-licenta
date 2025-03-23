import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../service/authService.jsx";
import {Box, Dialog, Modal, TextField} from '@mui/material';
import NavBar from "./NavBar.jsx";
import styles from "../assets/css/login.module.css"
import tooth from "../assets/login_photo/tooth.png"
import InfoBox from "./InfoBox.jsx";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // Control modal
    const [modalStep, setModalStep] = useState(1); // Etapa curentă din modal
    const [resetCode, setResetCode] = useState(''); // Codul de resetare
    const [resetEmail, setResetEmail] = useState(''); // Emailul pentru resetare
    const [newPassword, setNewPassword] = useState(''); // Noua parolă
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorText, setErrorText] = useState("");
    const [infoResetPwdBoxVisible, setCloseInfoResetPwdBoxVisible] = useState(false);
    const [infoResetPwdErrorBoxVisible, setCloseInfoResetPwdErrorBoxVisible] = useState(false);
    const [infoSendCodeBoxVisible, setInfoSendCodeBoxVisibleBoxVisible] = useState(false);
    const [infoSendCodeErrorBoxVisible, setInfoSendCodeErrorBoxVisible] = useState(false);
    const navigator = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                const decodedToken = parseJwt(token);
                const role = decodedToken.role;
                console.log(token)
                if (role === "ADMIN") {
                    navigator('/Home');
                } else if (role === "PATIENT") {
                    navigator("/Home");
                }
                else if (role === "RADIOLOGIST") {
                    navigator("/Home");
                }else {
                    alert('Rol necunoscut.');
                }
            }
        } catch (error) {
            if (error.response) {
                if(error.response.data.message=="Wrong password"){
                    setShowErrorModal(true);
                    setErrorText("Parola pe care ați introdus-o este gresită! Încercați iar.");
                    setErrorTitle("Parolă greșită");
                }
                else if(error.response.data.message=="The email is not registered"){
                    setShowErrorModal(true);
                    setErrorText("Adresa de e-mail pe care ați introdus-o nu este asociată unui cont.");
                    setErrorTitle("Email neînregistrat");
                }
            } else if (error.request) {
                setShowErrorModal(true);
                setErrorText("Eroare de autentificare: Nu s-a primit niciun răspuns de la server.");
                setErrorTitle("Eroare");
            } else {
                setShowErrorModal(true);
                setErrorText('Eroare de autentificare: ' + error.message);
                setErrorTitle("Eroare");
            }
        }
    };

    const handlePasswordReset = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password/send-verification-code', {
                email: resetEmail,
            });
            if (response.status === 200) {
                //setInfoSendCodeBoxVisibleBoxVisible(true);
                setModalStep(2);
                setResetEmail(null);
            }
        } catch (error) {
            setInfoSendCodeErrorBoxVisible(true);
        }
    };

    const handleModalSubmit = async () => {
        try {
            console.log(resetEmail)
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password/ver-code', {
                email: resetEmail,
                code: resetCode,
                newPassword: newPassword,
            });
            if (response.status === 200) {

                setCloseInfoResetPwdBoxVisible(true);
                setShowModal(false);
            }
        } catch (error) {
            setCloseInfoResetPwdErrorBoxVisible(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalStep(1);
    };

    const handleCloseErrorModal = () => setShowErrorModal(false);



    const closeInfoRestPasswordBox = () => {
        setCloseInfoResetPwdBoxVisible(false);
    };
    const closeInfoRestPasswordErrorBox = () => {
        setCloseInfoResetPwdErrorBoxVisible(false);
    };

    const closeInfoSendCodeErrorBox = () => {
        setInfoSendCodeErrorBoxVisible(false);
    };
    const closeInfoSendCodeBox = () => {
        setInfoSendCodeBoxVisibleBoxVisible(false);
    };

    return (
        <div className={styles["page"]}>
            <NavBar></NavBar>
            {infoResetPwdBoxVisible && <InfoBox message={"Parola a fost schimbată cu succes"} onClose={closeInfoRestPasswordBox}/>}
            {infoResetPwdErrorBoxVisible && <InfoBox message={"Eroare la resetarea parolei"} onClose={closeInfoRestPasswordErrorBox}/>}
            {infoSendCodeBoxVisible && <InfoBox message={"Codul pentru resetarea parolei a fost trimis pe e-mail."} onClose={closeInfoSendCodeBox}/>}
            {infoSendCodeErrorBoxVisible && <InfoBox message={"Eroare la trimiterea codului pentru resetarea parolei."} onClose={closeInfoSendCodeErrorBox}/>}
            <div className={styles.card}>
                <div className={styles["card-container"]}>
                    <h1 className={styles.helloMsg}>BINE AȚI REVENIT</h1>
                    <img className={styles["tooth-img"]} src={tooth}></img>
                    <form  className={styles.loginForm} onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    placeholder="adresa e-mail"
                                    required
                                    id="register-email-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="parola"
                                    required
                                    id="register-password-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={styles["submit"]}>Conectează-te</button>
                        </form>

                        <p className={styles["forgot-password-link"]} onClick={() => setShowModal(true)} >
                            Ati uitat parola?
                        </p>

                        <h2 onClick={() => navigator("/Register")}
                            className={styles["register-link"]}>
                            Nu aveti un cont? <br />Creati unul
                        </h2>
                    </div>
                </div>

            <Modal open={showErrorModal} onClose={handleCloseErrorModal}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>{errorTitle}</h2>
                    <p className={styles.text}>{errorText}
                    </p>
                </Box>
            </Modal>
            <Dialog open={showModal} onClose={closeModal} className={styles.resetPasswordBox}>
                <h2 className={styles.resetPwdTitle}>Resetează Parola</h2>
                <div className={styles.resetPasswordBox}>
                    {modalStep === 1 && (
                        <>
                            <TextField
                                margin="dense"
                                label="Adresa de e-mail"
                                type="email"
                                fullWidth
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <button onClick={handlePasswordReset} className={styles.sendCodeBtn}>
                                Trimite Cod
                            </button>
                        </>
                    )}
                    {modalStep === 2 && (
                        <>
                            <TextField
                                margin="dense"
                                label="Adresa de e-mail"
                                type="email"
                                fullWidth
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Codul de resetare"
                                type="text"
                                fullWidth
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Noua parolă"
                                type="password"
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </>
                    )}

                    <button className={styles.closeBtn} onClick={closeModal}>
                        Închide
                    </button>
                    {modalStep === 2 && (
                        <button className={styles.resetPwd} onClick={handleModalSubmit}>
                            Resetează Parola
                        </button>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default Login;
