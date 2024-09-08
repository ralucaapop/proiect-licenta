import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {parseJwt} from "../service/authService.jsx";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                console.log('Autentificare reușită', response.data);

                // Salvăm token-ul în localStorage
                const token = response.data.token; // Asigură-te că răspunsul conține token-ul sub această cheie
                localStorage.setItem('token', token);

                // Decodăm token-ul pentru a extrage rolul
                const decodedToken = parseJwt(token); // Funcția parseJwt pentru a decoda token-ul
                const role = decodedToken.role;

                console.log('Token decodat:', decodedToken);

                // Redirecționare în funcție de rolul utilizatorului
                if (role === "ADMIN") {
                    navigator('/MainPageAdmin');
                } else if (role === "PATIENT") {
                    navigator('/patientMainPage');
                } else {
                    alert('Rol necunoscut.');
                }
            }
        } catch (error) {
            // Verifică dacă răspunsul de eroare există
            if (error.response) {
                // Răspunsul de eroare de la server
                console.error('Eroare de la server:', error.response.data);
                alert('Eroare de autentificare: ' + error.response.data.message || error.response.statusText);
            } else if (error.request) {
                // Cererea a fost făcută, dar nu s-a primit niciun răspuns
                console.error('Cererea a fost făcută, dar nu s-a primit niciun răspuns:', error.request);
                alert('Eroare de autentificare: Nu s-a primit niciun răspuns de la server.');
            } else {
                // Altă eroare
                console.error('Eroare la autentificare:', error.message);
                alert('Eroare de autentificare: ' + error.message);
            }
        }
    };
    return (
        <div className="page">
            <div className="container">
                <div className="card-container">
                    <div className="card-content">
                        <h1 className="helloMsg">BINE AȚI REVENIT</h1>
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
                                    placeholder="Parola"
                                    required
                                    id="register-password-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                        <h2 className="forgot-password-link">Ati uitat parola?</h2>
                        <h2 className="register-link">Nu aveti un cont?</h2>
                        <h2 className="register-link">Creati unul</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
