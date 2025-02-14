import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../service/authService.jsx";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import NavBar from "./NavBar.jsx";
import styles from "../assets/css/login.module.css"
import tooth from "../assets/login_photo/tooth.png"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // Control modal
    const [modalStep, setModalStep] = useState(1); // Etapa curentă din modal
    const [resetCode, setResetCode] = useState(''); // Codul de resetare
    const [resetEmail, setResetEmail] = useState(''); // Emailul pentru resetare
    const [newPassword, setNewPassword] = useState(''); // Noua parolă
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
                alert('Eroare de autentificare: ' + error.response.data.message || error.response.statusText);
            } else if (error.request) {
                alert('Eroare de autentificare: Nu s-a primit niciun răspuns de la server.');
            } else {
                alert('Eroare de autentificare: ' + error.message);
            }
        }
    };

    const handlePasswordReset = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password/send-verification-code', {
                email: resetEmail,
            });
            if (response.status === 200) {
                alert('Codul de resetare a fost trimis pe email.');
                setModalStep(2); // Mergem la etapa 2 pentru introducerea codului și noii parole
            }
        } catch (error) {
            alert('Eroare la trimiterea codului de resetare.');
        }
    };

    const handleModalSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password/ver-code', {
                email: resetEmail,
                code: resetCode,
                newPassword: newPassword,
            });
            if (response.status === 200) {
                alert('Parola a fost resetată cu succes.');
                setShowModal(false); // Închidem modalul
            }
        } catch (error) {
            alert('Eroare la resetarea parolei.');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalStep(1); // Revenim la prima etapă dacă se închide modalul
    };

    return (
        <div className={styles["page"]}>
                <div className={styles["card-container"]}>
                    <div className={styles["card-content"]}>
                        <h1 className="helloMsg">BINE AȚI REVENIT</h1>
                        <img className={styles["tooth-img"]} src={tooth}></img>
                        <form onSubmit={handleSubmit}>
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
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>

                        <h2 className={styles["forgot-password-link"]} onClick={() => setShowModal(true)} >
                            Ati uitat parola?
                        </h2>

                        <h2 onClick={() => navigator("/Register")}
                            className={styles["register-link"]}>
                            Nu aveti un cont? <br />Creati unul
                        </h2>
                    </div>
            </div>

            {/* Modalul pentru resetarea parolei folosind Material UI */}
            <Dialog open={showModal} onClose={closeModal}>
                <DialogTitle>Resetează Parola</DialogTitle>
                <DialogContent>
                    {modalStep === 1 && (
                        <>
                            <TextField
                                margin="dense"
                                label="Introdu emailul"
                                type="email"
                                fullWidth
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <Button onClick={handlePasswordReset} variant="contained" color="primary">
                                Trimite Cod
                            </Button>
                        </>
                    )}
                    {modalStep === 2 && (
                        <>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="secondary">
                        Închide
                    </Button>
                    {modalStep === 2 && (
                        <Button onClick={handleModalSubmit} variant="contained" color="primary">
                            Resetează Parola
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Login;
