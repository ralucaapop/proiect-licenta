import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PatientMainPage from "./components/PatientMainPage.jsx";
import GeneralAnamnesisPage from "./components/GeneralAnamnesisPage.jsx";
import PatientPersonalDataPage from "./components/PatientPersonalDataPage.jsx";
import RequestAppointment from "./components/RequestAppointment.jsx";
import PatientHistoryData from "./components/PatientHisotryData.jsx";
import MainPageAdmin from "./components/MainPageAdmin.jsx";
import PatientsDoctor from "./components/PatientsDoctor.jsx";
import AppointmentsDoctor from "./components/AppointmentsDoctor.jsx";
import Materials from "./components/Materials.jsx";
import SchedulareAppointmentsPageAdmin from "./components/SchedulareAppointmentsPageAdmin.jsx";
import PatientRoute from "./components/PatientRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PatientPersonalData from "./components/PatientsDoctorComponents/PatientPersonalData.jsx";
import PatientStatus from "./components/PatientsDoctorComponents/PatientStatus.jsx";
import PatientRadiography from "./components/PatientsDoctorComponents/PatientRadiography.jsx";
import PatientGeneralAnamnesis from "./components/PatientsDoctorComponents/PatientGeneralAnamnesis.jsx";
import PatientAppointmentsForDoctor from "./components/PatientsDoctorComponents/PatientAppointmentsForDoctor.jsx";
import TreatmentSheetPatientView from "./components/TreatmentSheetPatientView.jsx";
import XrayPatient from "./components/XrayPatient.jsx";

function App(){

    return(
        <Router>
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path='/' element={ <Home /> } />
                        <Route path='/Register' element={<Register></Register>}/>
                        <Route path='/Login' element={<Login></Login>}/>
                        <Route path='/Home' element={<Home></Home>}/>
                        <Route path='/PatientMainPage' element={<PatientRoute><PatientMainPage/></PatientRoute>}/>
                        <Route path='/GeneralAnamnesisPage' element={<PatientRoute><GeneralAnamnesisPage/></PatientRoute>}/>
                        <Route path='/PatientPersonalDataPage' element={<PatientPersonalDataPage/>}/>
                        <Route path='/RequestAppointment' element={<PatientRoute><RequestAppointment/></PatientRoute>}/>
                        <Route path='/PatientHistoryData' element={<PatientHistoryData></PatientHistoryData>}/>
                        <Route path='/MainPageAdmin' element={<AdminRoute><MainPageAdmin></MainPageAdmin></AdminRoute>}/>
                        <Route path='/PatientsDoctor' element={<AdminRoute><PatientsDoctor></PatientsDoctor></AdminRoute>}/>
                        <Route path='/AppointmentsDoctor' element={<AdminRoute><AppointmentsDoctor></AppointmentsDoctor></AdminRoute>}/>
                        <Route path='/Materials' element={<AdminRoute><Materials></Materials></AdminRoute>}/>
                        <Route path='/SchedulareAppointmentsPageAdmin' element={<AdminRoute><SchedulareAppointmentsPageAdmin></SchedulareAppointmentsPageAdmin></AdminRoute>}/>
                        <Route path='/PatientPaersonalDataA' element={<AdminRoute><PatientPersonalData></PatientPersonalData></AdminRoute>}/>
                        <Route path='/PatientStatusA' element={<AdminRoute><PatientStatus></PatientStatus></AdminRoute>}/>
                        <Route path='/PatientRadiographyA' element={<AdminRoute><PatientRadiography></PatientRadiography></AdminRoute>}/>
                        <Route path='/PatientGeneralAnamnesisA' element={<AdminRoute><PatientGeneralAnamnesis></PatientGeneralAnamnesis></AdminRoute>}/>
                        <Route path='/PatientAppointmentsA' element={<AdminRoute><PatientAppointmentsForDoctor></PatientAppointmentsForDoctor></AdminRoute>}/>
                        <Route path='/TreatmentSheetPatientView' element={<PatientRoute><TreatmentSheetPatientView></TreatmentSheetPatientView></PatientRoute>}/>
                        <Route path='/XRaysPatient' element={<PatientRoute><XrayPatient></XrayPatient></PatientRoute>}/>

                    </Routes>
                </div>
            </div>
        </Router>

    )
}

export default App;