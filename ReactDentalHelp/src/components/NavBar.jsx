import  {useState} from 'react';
import styles from '../assets/css/Navbar.module.css';
import {isTokenValid, parseJwt} from "../service/authService.jsx";
import logo from "../assets/login_photo/tooth.png"
import {useNavigate} from "react-router-dom";


const Navbar = () => {

    const navigate = useNavigate();
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token && isTokenValid(token);
    };

    const handleMenuNavigation = () =>{
        const token = localStorage.getItem('token')
        const decodedToken = parseJwt(token);
        if(decodedToken.role === "ADMIN")
            navigate("/MainPageAdmin")
        else
            navigate("/PatientMainPage")

    }

    return (
        <nav className={styles["navbar"]}>
            <a href="/" className={styles["logo"]}>
                <img src={logo} alt="DENTHELP"/>
                <p className={styles["logo-name"]}>DENT<br/>HELP</p>
            </a>
            <div className={styles["navLinks"]}>
                {isAuthenticated() ? (
                    <>
                        <button className={styles["logout-btn"]}>Logout</button>
                        <button onClick={handleMenuNavigation} className={styles["menu-btn"]}>Meniu</button>
                    </>
                ) : (
                    <>
                        <a href="/login" className={styles["link"]}>Login</a>
                    </>
                )}
                <a href="/about" className={styles["link"]}>Despre noi</a>
                <a href="/contact" className={styles["link"]}>Contact</a>
            </div>
        </nav>
    );

};

export default Navbar;
