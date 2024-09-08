import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Card from "./components/Card.jsx"
import Button from "./components/Button.jsx";
import IserGreeting from "./components/IserGreeting.jsx";
import List from "./components/List.jsx"
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

function App(){

    /*
    const fruits = [{name:"orange", calories:95, id:1},
        {name: "banana", calories:45, id:2},
        {name: "apple", calories:105, id:3},
        {name: "strawberries", calories:35, id:4},
        {name: "cocounut", calories:195, id:5}];
    return(
    <>

        <Button></Button>
        <IserGreeting isLoggedI={true} ></IserGreeting>

        <List items={fruits} category="Fruits"/>

    </>)*/
    return(
        <Router>
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path='/' element={ <Home /> } />
                        <Route path='/Register' element={<Register></Register>}/>
                        <Route path='/Login' element={<Login></Login>}/>
                        <Route path='/Home' element={<Home></Home>}/>
                        <Route path='/PatientMainPage' element={<PatientMainPage/>}/>
                        <Route path='/GeneralAnamnesisPage' element={<GeneralAnamnesisPage/>}/>
                        <Route path='/PatientPersonalDataPage' element={<PatientPersonalDataPage/>}/>
                        <Route path='/RequestAppointment' element={<RequestAppointment/>}/>
                        <Route path='/PatientHistoryData' element={<PatientHistoryData></PatientHistoryData>}/>
                        <Route path='/MainPageAdmin' element={<MainPageAdmin></MainPageAdmin>}/>
                        <Route path='/PatientsDoctor' element={<PatientsDoctor></PatientsDoctor>}/>
                        <Route path='/AppointmentsDoctor' element={<AppointmentsDoctor></AppointmentsDoctor>}/>
                        <Route path='/Materials' element={<Materials></Materials>}/>
                        <Route path='/SchedulareAppointmentsPageAdmin' element={<SchedulareAppointmentsPageAdmin></SchedulareAppointmentsPageAdmin>}/>
                    </Routes>
                </div>
            </div>
        </Router>

    )
}

export default App;