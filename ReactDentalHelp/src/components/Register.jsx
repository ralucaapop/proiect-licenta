import { useNavigate } from 'react-router-dom';
import '../assets/css/register.css';
import manImage from '../assets/register_photo/man.png';
import womenImage from '../assets/register_photo/women.png';
import {useState} from "react";
import axios from "axios";
import VerificationCodeNewAccount from "./VerificationCodeNewAccount.jsx";

function Register() {

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setSecondName] = useState("");
    const [cnp, setCnp] = useState("");
    const [password, setPassword] = useState("");
    const [reTypePassword, setRePassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigator = useNavigate();


    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        const patternForLetters = /.*[a-zA-Z].*/;
        const patternForDigit = /.*\d+.*/;
        const regexForEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Verifică adresa de email
        if (!regexForEmail.test(email)) {
            alert('Adresa de email este invalidă');
            return;
        }

        // Verifică lungimea parolei
        if (password.length < 8) {
            alert('Parola trebuie să aibă cel puțin 8 caractere');
            return;
        }

        // Verifică dacă parola conține cel puțin o cifră
        if (!patternForDigit.test(password)) {
            alert('Parola trebuie să conțină cel puțin o cifră');
            return;
        }

        // Verifică dacă parola conține cel puțin o literă
        if (!patternForLetters.test(password)) {
            alert('Parola trebuie să conțină cel puțin o literă');
            return;
        }

        // Verifică dacă parolele coincid
        if (password !== reTypePassword) {
            alert('Parolele nu coincid');
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
                // Deschide dialogul de verificare
                setIsDialogOpen(true);
            } else {
                alert('Eroare la înregistrare: ' + response.statusText);
            }
        } catch (error) {
            console.error('Eroare de la server:', error.response ? error.response.data : error.message);
            alert('Eroare la înregistrare: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false); // Închide dialogul
    };

    const handleDialogSubmit = async (code) => {
        console.log('Codul introdus:', code);

        // Trimiterea cererii la server
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register/verification', {
                email: email,
                firstName: firstName,
                lastName: lastName,
                cnp: cnp,
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

        // Continuă cu logica necesară după introducerea codului
    };

    return (
        <div className="page">
            <img src={manImage} className="left-image-reg" alt="Man" />
            <div className="container">
                <div className="card-container">
                    <div className="card-content">
                        <h1 className="helloMsg">BINE AȚI VENIT</h1>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-group">
                                <input placeholder="Nume" required id="register-firstName-input" value={firstName}
                                       onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <input placeholder="Prenume" required id="register-lastName-input" value={lastName}
                                       onChange={(e) => setSecondName(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <input placeholder="CNP" required id="register-cnp-input" value={cnp}
                                       onChange={(e) => setCnp(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <input placeholder="Adresa e-mail" required id="register-email-input" value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <input type="password" placeholder="Parola" required id="register-password-input"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <input type="password" placeholder="Repetă parola" required
                                       id="register-repassword-input" value={reTypePassword}
                                       onChange={(e) => setRePassword(e.target.value)}/>
                            </div>
                            <button type="submit" className="btn">Crează Cont</button>
                        </form>
                    </div>
                </div>
            </div>
            <img src={womenImage} className="right-image-reg" alt="Woman" />
            {/* Adăugăm dialogul de verificare */}
            <VerificationCodeNewAccount
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
}

export default Register;
