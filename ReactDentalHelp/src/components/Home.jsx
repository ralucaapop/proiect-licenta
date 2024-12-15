import {useLocation, useNavigate} from "react-router-dom";
import styles from "../assets/css/Home.module.css";
import { isTokenValid, parseJwt } from "../service/authService.jsx";
import NavBar from "./NavBar.jsx";
import first_img from "../assets/home_photo/1.png";
import stain from "../assets/home_photo/pata.png";
import appointmentCardPic from "../assets/cards_photos/appointment.png";
import medicalHistoryCardPic from "../assets/cards_photos/health-report.png";
import kidsCardPic from "../assets/cards_photos/kids.png";
import stylesCard from "../assets/css/PatientMainPage.module.css";
import ortoPic from "../assets/home_photo/orto.png"
import patients from "../assets/cards_photos/patients.png";
import kids from "../assets/home_photo/kids-service.png"
import consultPic from "../assets/home_photo/general-consult.png"
import esteticaPic from "../assets/home_photo/estetica.png"
import medic from "../assets/home_photo/medic.png"
import KidsMainPage from "./KidsMainPage.jsx";
import {useEffect} from "react";

function Home() {
    const navigate = useNavigate();

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token && isTokenValid(token);
    };

    const getUserRole = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            return decodedToken.role;
        }
        return null;
    };

    const handleAppointmentClick = () => {
        if (isAuthenticated()) {
            const token = localStorage.getItem('token');
            const decodedToken = parseJwt(token);
            if (decodedToken.role === "PATIENT") {
                navigate("/GeneralPatientBoard/request");
            } else {
                navigate("/MainPageAdmin");
            }
        } else {
            navigate("/Login");
        }
    };

    const handleClickPersonalData = () => {
        if (isAuthenticated()) {
            navigate("/GeneralPatientBoard/personal");
        }
        else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }
    };

    const handleClickKids = () => {
        if (isAuthenticated()) { // Asigură-te că ai această funcție
            navigate("/GeneralPatientBoard/kids"); // Trimite componenta dorită
        }
        else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }
    };


    const handleRequestAppointment = () => {
        if (isAuthenticated()) {
            navigate("/GeneralPatientBoard/request");
        }
        else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }
    };

    const handleAppointments = () => {
        if (isAuthenticated()){
            navigate("/GeneralAdminBoard/appointments");
        } else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }

    };
    const handlePatients = () => {
        if (isAuthenticated()){
        navigate("/GeneralAdminBoard/patients");
        }
        else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }
    };

    const isLoggedIn = isAuthenticated();
    const userRole = getUserRole();

    const location = useLocation();

    // Derulăm automat la secțiunea specificată în hash când componenta este montată
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace('#', '');
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className={styles.page}>
            <NavBar/>
            <div className={styles["content-container"]}>
                <div className={styles["text-content"]}>
                    <h1 className={styles.title}>DENTALCARE</h1>
                    <p className={styles.subtitle}>
                        Fie că sunteți aici pentru un control de rutină sau pentru o transformare completă,<br/> suntem
                        aici pentru a vă ajuta să obțineți zâmbetul visurilor dumneavoastră.
                    </p>
                    <p className={styles.proposition}>Zâmbetul tău, <br/> pasiunea noastră</p>
                    <button onClick={handleAppointmentClick} className={styles["appointment-button"]}>
                        Cere o programare
                    </button>
                </div>
                <div className={styles["right-images"]}>
                    <img src={first_img} className={styles["right-image"]} alt="Right Image"/>
                    <img src={stain} className={styles["stain-image"]} alt="Spot Image"/>
                </div>
            </div>

            {/* Afișăm cardurile doar pentru utilizator neautentificat sau pacient */}
            {(userRole === "PATIENT") && (
                <div className={styles.section} id="options-section">
                    <h2 className={styles["title-options"]}>Opțiunile Tale</h2>
                    <p className={styles["intro-options"]}>
                        Bun venit la secțiunea „Opțiunile Tale”! Aici vei găsi tot ce ai nevoie pentru a gestiona
                        programările tale, a accesa istoricul medical și a administra informațiile personale.
                        Explorează funcționalitățile noastre și alege ce ți se potrivește cel mai bine!
                    </p>

                    <div className={stylesCard.cards}>
                        <div className={stylesCard.card} onClick={handleRequestAppointment}>
                            <img src={appointmentCardPic} alt="Appointment"/>
                            <h3 className={stylesCard["card-title"]}>Cere o programare</h3>
                            <p className={stylesCard["card-description"]}>Rezervați o întâlnire rapidă și ușor.</p>
                        </div>

                        <div className={stylesCard.card} onClick={handleClickPersonalData}>
                            <img src={medicalHistoryCardPic} alt="Medical History"/>
                            <h3 className={stylesCard["card-title"]}>Istoric și Date Personale</h3>
                            <p className={stylesCard["card-description"]}>Accesează istoricul medical și datele tale
                                personale.</p>
                        </div>

                        <div className={stylesCard.card} onClick={handleClickKids}>
                            <img src={kidsCardPic} alt="Kids"/>
                            <h3 className={stylesCard["card-title"]}>Copii</h3>
                            <p className={stylesCard["card-description"]}>
                                Gestionează programările și informațiile medicale ale copiilor.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Afișăm conținutul pentru admin */}
            {userRole === "ADMIN" && (
                <div className={styles.section} id="options-section">
                    <h2 className={styles["title-options"]}>Opțiunile Tale</h2>
                    <p className={styles["intro-options"]}>
                        Bun venit la secțiunea „Opțiunile Tale”! Aici vei găsi tot ce ai nevoie pentru a gestiona
                        programările pacientilor, si monitorizarea acestora.
                    </p>
                    <div id="options-section" className={stylesCard.cards}>
                        <div className={stylesCard.card} onClick={handleAppointments}>
                            <img src={appointmentCardPic} alt="Appointments"/>
                            <h3 className={stylesCard["card-title"]}>Programari</h3>
                            <p className={stylesCard["card-description"]}>Geastioneaza-ti mai bine timpul</p>
                        </div>

                        <div className={stylesCard.card} onClick={handlePatients}>
                            <img src={patients} alt="Patients"/>
                            <h3 className={stylesCard["card-title"]}>Pacienti</h3>
                            <p className={stylesCard["card-description"]}>Informatii despre pacientii tai</p>
                        </div>
                    </div>
                </div>
            )}

            <div id="services" className={styles["services-section"]}>
                <h2 className={styles["services-title"]}>Serviciile Noastre</h2>
                <div className={styles["services-container"]}>

                    <div className={styles["service-card"]}>
                        <div className={styles["flip-card-inner"]}>
                            <div className={styles["flip-card-front"]}>
                                <img src={consultPic} alt="Consultație"/>
                                <h3>Consultații Generale</h3>
                                <p>Evaluăm sănătatea dentară și oferim sfaturi personalizate.</p>
                            </div>
                            <div className={styles["flip-card-back"]}>
                                <h3>Detalii Serviciu</h3>
                                <p>Consultația generală include o evaluare detaliată a sănătății dentare, discuții
                                    despre opțiunile de tratament și sfaturi pentru menținerea unui zâmbet sănătos.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles["service-card"]}>
                        <div className={styles["flip-card-inner"]}>
                            <div className={styles["flip-card-front"]}>
                                <img src={ortoPic} alt="Ortodonție"/>
                                <h3>Tratamente Ortodontice</h3>
                                <p>Corectăm poziționarea dinților pentru un zâmbet perfect.</p>
                            </div>
                            <div className={styles["flip-card-back"]}>
                                <h3>Detalii Serviciu</h3>
                                <p>Tratamentele ortodontice includ corectarea aliniamentului dentar prin
                                    aparate dentare și alte dispozitive specializate. Acestea ajută la
                                    îmbunătățirea funcției și esteticii dentare, prevenind probleme pe termen lung.
                                    Oferim soluții pentru adulți și copii, incluzând opțiuni moderne precum aparatele
                                    dentare invizibile (Invisalign) și tradiționale (metalice, ceramice)</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles["service-card"]}>
                        <div className={styles["flip-card-inner"]}>
                            <div className={styles["flip-card-front"]}>
                                <img src={esteticaPic} alt="Estetică Dentară"/>
                                <h3>Estetică Dentară</h3>
                                <p>Albire, fațete dentare și alte soluții pentru un zâmbet strălucitor.</p>
                            </div>
                            <div className={styles["flip-card-back"]}>
                                <h3>Detalii Serviciu</h3>
                                <p>Serviciile de estetică dentară includ o gamă variată de tratamente menite să
                                    îmbunătățească aspectul zâmbetului dumneavoastră. Oferim soluții precum albirea
                                    dinților, fațete dentare din porțelan sau compozit, și restaurări estetice, toate
                                    personalizate pentru a se potrivi nevoilor și dorințelor fiecărui pacient. Scopul
                                    nostru este de a vă ajuta să obțineți un zâmbet sănătos și atractiv, care să vă
                                    inspire încredere.</p>

                            </div>
                        </div>
                    </div>

                    <div className={styles["service-card"]}>
                        <div className={styles["flip-card-inner"]}>
                            <div className={styles["flip-card-front"]}>
                                <img src={kids} alt="Copii"/>
                                <h3>Tratamente pentru Copii</h3>
                                <p>Servicii prietenoase pentru cei mici, într-un mediu confortabil.</p>
                            </div>
                            <div className={styles["flip-card-back"]}>
                                <h3>Detalii Serviciu</h3>
                                <p>Tratamentele dentare pentru copii sunt concepute special pentru a răspunde nevoilor
                                    dentare ale celor mici. Oferim servicii precum controale regulate, igienă orală,
                                    sigilări dentare și tratamente ortodontice timpurii, toate realizate într-un mediu
                                    prietenos și confortabil. Lucram cu răbdare și
                                    înțelegere pentru a-i ajuta pe copii să se simtă confortabil la dentist și să își
                                    dezvolte obiceiuri sănătoase pentru o viață întreagă. Ne concentrăm pe educația
                                    orală, ajutând copiii să înțeleagă importanța igienei dentare.</p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div id="history" className={styles['history-section']}>
                <div className={styles["history-content"]}>
                <h2 className={styles["history-title"]}>Istoria Cabinetului</h2>
                <p className={styles["history-text"]}>
                    La începuturile sale, cabinetul nostru a fost creat dintr-o pasiune profundă pentru stomatologie.
                    De-a lungul anilor, am evoluat și am crescut, dar misiunea noastră a rămas aceeași:
                    să oferim servicii de înaltă calitate într-un mediu care să se simtă ca acasă.
                    Fiecare pacient este tratat cu atenție și respect, iar zâmbetul vostru este cea mai bună recompensă pentru noi.
                </p>

                <div className={styles["doctor-profile"]}>
                    <div className={styles["profile-card"]}>
                        <img src={medic} alt="Dr. Popescu" className={styles["doctor-photo"]}/>
                        <div className={styles["doctor-info"]}>
                            <h2 className={styles["doctor-title"]}>Despre Dr. Popescu</h2>
                            <p className={styles["doctor-text"]}>
                                Cu o carieră care se întinde pe 15 ani, Dr. Popescu a devenit un expert în domeniul său.
                                Dedicat sănătății pacienților săi, el creează un mediu relaxat, unde fiecare vizită este o experiență pozitivă.
                                Aici, pacienții nu doar că primesc tratamente de calitate,
                                dar sunt și educați în privința sănătății dentare, pentru a face alegeri informate pentru viitor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <div id="contact" className={styles["contact-section"]}>
                <h2 className={styles["contact-title"]}>Contactați-ne</h2>
                <p className={styles["contact-description"]}>
                    Suntem aici să vă răspundem la întrebări și să vă ajutăm cu orice informații de care aveți nevoie.
                    Nu ezitați să ne contactați folosind datele de mai jos.
                </p>

                <div className={styles["contact-info"]}>
                    <div className={styles["contact-item"]}>
                        <h3 className={styles["contact-item-title"]}>Adresă:</h3>
                        <p className={styles["contact-item-text"]}>Strada Exemplu, Nr. 10, București, România</p>
                    </div>
                    <div className={styles["contact-item"]}>
                        <h3 className={styles["contact-item-title"]}>Telefon:</h3>
                        <p className={styles["contact-item-text"]}>+40 123 456 789</p>
                    </div>
                    <div className={styles["contact-item"]}>
                        <h3 className={styles["contact-item-title"]}>Email:</h3>
                        <p className={styles["contact-item-text"]}>contact@cabinetdentist.ro</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
