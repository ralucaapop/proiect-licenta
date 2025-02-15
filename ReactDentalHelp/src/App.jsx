import Register from "./components/Register.jsx";
import "./App.css"
import 'react-chat-widget/lib/styles.css';
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
import KidsMainPage from "./components/KidsMainPage.jsx";
import HandleKidAccount from "./components/HandleKidAccount.jsx";
import GeneralPatientBoard from "./components/GeneralPatientBoard.jsx";
import NotificationsAdmin from "./components/NotificationsAdmin.jsx";
import GeneralAdminBoard from "./components/GeneralAdminBoard.jsx";
import CabActivity from "./components/CabActivity.jsx";
import PatientAppointmentRequests from "./components/PatientAppointmentRequests.jsx";
import GeneralDentalStaus from "./components/GeneralDentalStatus.jsx";
import GeneralDentalStatus from "./components/GeneralDentalStatus.jsx";
import Chatbot from "./components/Chatbot.jsx";
import {useState} from "react";
import {addResponseMessage, Widget} from "react-chat-widget";
import GeneralRadiologistBoard from "./components/GeneralRadiologistBoard.jsx";

function App(){
    const [isOpen, setIsOpen] = useState(false);
    const API_KEY =""
    const [messages, setMessages] = useState([
        {
            message:"Bună ziua! Cu ce vă pot ajuta?",
            sender: "ChatGPT"
        }
    ])

    const handleSend = async (message) =>{
        const newMessage = {
            message: message,
            sender: "user"
        }

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        console.log(newMessages)
        await processMessageToChatGPT(newMessages);
    }

    async function processMessageToChatGPT(chatMessages){
        let apiMessages = chatMessages.map((messageObject) =>{
            let role = "";
            if(messageObject.sender === "ChatGPT"){
                role="assistant"
            }
            else{
                role = "user"
            }
            return {role:role, content: messageObject.message}
        });

        const requirements = "I want you to act like you are a dental assistant. Give short answers and respond in the language that the user addresses you." +
            "If the user asks about medical advices give him some short advice, but remind him that he always should contact a doctor." +
            "Respond just to question related to dental problems and information about the cabinet, if there is another type of question please say that you can not help." +
            "Now, there are the cabinet information: The address is: Strada Gheorghe Lazăr 12, Timisoara, the program: every monday to saturday from 7 am. to 8 pm. " +
            "The cabinet services can be find in our website." +
            " Contact information: tel: 0721321111, email: contact@denthelp.ro. For appointments use the special section from our website, or call by number."

        const systemMessage = {
            role: "system",
            content: requirements
        }

        const apiRequestBody={
            "model" : "gpt-3.5-turbo",
            "messages" : [systemMessage,
                ...apiMessages]
        }

        await fetch("https://api.openai.com/v1/chat/completions",{
            method : "POST",
            headers:{
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) =>{
            return data.json();
        }).then((data) =>{
            setMessages([...chatMessages, {
                message: data.choices[0].message.content,
                sender: "ChatGPT"
            }])
            addResponseMessage(data.choices[0].message.content);
        });

    }

    const handleNewUserMessage = (newMessage) => {
        handleSend(newMessage)
    };
    return(
        <Router>
            <div className="App">
                <div style={{padding:0}} className="content">
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
                        <Route path='/KidsMainPage' element={<PatientRoute><KidsMainPage></KidsMainPage></PatientRoute>}/>
                        <Route path='/HandleKidAccount' element={<PatientRoute><HandleKidAccount></HandleKidAccount></PatientRoute>}></Route>
                        <Route path='/GeneralPatientBoard/:component' element={<PatientRoute><GeneralPatientBoard></GeneralPatientBoard></PatientRoute>}></Route>
                        <Route path='/NotificationsAdmin' element={<AdminRoute><NotificationsAdmin></NotificationsAdmin></AdminRoute>}></Route>
                        <Route path='/GeneralAdminBoard/:component' element={<AdminRoute><GeneralAdminBoard></GeneralAdminBoard></AdminRoute>}></Route>
                        <Route path='/CabActivity' element={<CabActivity></CabActivity>}/>
                        <Route path='/GeneralDentalStatus' element={<PatientRoute><GeneralDentalStatus/></PatientRoute>}/>
                        <Route path='/Chatbot' element={<PatientRoute><Chatbot></Chatbot></PatientRoute>}/>
                        <Route path='/GeneralRadiologistBoard/:component' element={<PatientRoute><GeneralRadiologistBoard></GeneralRadiologistBoard></PatientRoute>}/>
                    </Routes>
                </div>
                <Widget
                    handleNewUserMessage={handleNewUserMessage}
                    title="Asistentul virtual"
                    subtitle="Cum vă putem ajuta?"
                    open={isOpen}
                    handleToggle={() => setIsOpen(!isOpen)}
                />
            </div>
        </Router>

    )
}

export default App;