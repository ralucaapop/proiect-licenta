import PatientPersonalDataPage from "./PatientPersonalDataPage.jsx";
import GeneralAnamnesis from "./GeneralAnamnesis.jsx";
import {useState} from "react";


function PatientHistoryData(){

    // Setează butonul activ la început
    const [activeComponent, setActiveComponent] = useState('A'); // Default este Componenta A

    // Funcția care afișează componenta corespunzătoare
    const renderComponent = () => {
        switch (activeComponent) {
            case 'A':
                return <PatientPersonalDataPage />;
            case 'B':
                return <GeneralAnamnesis />;
            case 'C':
                return <div/*ComponentC *//>;
            default:
                return <PatientPersonalDataPage />; // Componenta default
        }
    };

    return (
        <div>
            <div className="button-group">
                <button onClick={() => setActiveComponent('A')} className={activeComponent === 'A' ? 'active' : ''}>
                    Date personale ale pacientului
                </button>
                <button onClick={() => setActiveComponent('B')} className={activeComponent === 'B' ? 'active' : ''}>
                    Completeaza anamneza genera
                </button>
                <button onClick={() => setActiveComponent('C')} className={activeComponent === 'C' ? 'active' : ''}>
                    Istoric Programari
                </button>
            </div>

            <div className="component-display">
                {renderComponent()}
            </div>
        </div>
    );

}
export default PatientHistoryData