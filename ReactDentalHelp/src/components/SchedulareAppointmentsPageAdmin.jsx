import Scheduler from "./Scheduler.jsx";
import ConfirmAppointments from "./ConfirmAppointments.jsx";
import {useState} from "react";
import styles from '../assets/css/SchedulareAppointmentsPageAdmin.module.css'
import NavBar from "./NavBar.jsx";

function SchedulareAppointmentsPageAdmin() {
    const [activeComponent, setActiveComponent] = useState('scheduler');

    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className={styles["page"]}>
            <NavBar></NavBar>
            <div className={styles["content"]}>
                <div className={styles['slidebar']}>
                    <button
                        className={styles[activeComponent === 'scheduler' ? "slidebar-buttons-active" : "slidebar-buttons"]}
                        onClick={() => handleComponentChange('scheduler')}
                    >
                        Scheduler
                    </button>

                    <button
                        className={styles[activeComponent === 'confirmations' ? "slidebar-buttons-active" : "slidebar-buttons"]}
                        onClick={() => handleComponentChange('confirmations')}
                    >
                        Confirmări Programări
                    </button>
                </div>

                {/* Conținutul schimbabil */}
                <div style={{flexGrow: 1, padding: '20px'}}>
                    {activeComponent === 'scheduler' && <Scheduler/>}
                    {activeComponent === 'confirmations' && <ConfirmAppointments/>}
                </div>
            </div>
        </div>
    );
}

export default SchedulareAppointmentsPageAdmin;
