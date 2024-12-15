import styles from "../assets/css/CabActivity.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import axios from "axios";
import kidImg from  "../assets/icons/kids.png"
import adults from "../assets/icons/aduts.png"
import family from "../assets/icons/family.png"
import { useEffect, useState } from "react";

function CabActivity() {
    const [startDate, setStartDate] = useState(new Date());
    const [startDateService, setStartDateService] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endDateService, setEndDateService] = useState(new Date());
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredDataService, setFilteredDataService] = useState([]);
    const [patients, setPatients] = useState([]);
    const [patient_appointment, setPatientsAppointment] = useState([]);


    const [chartData, setChartData] = useState([]);
    const [chartDataService, setChartDataService] = useState([]);
    const serviceColors = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57", "#8dd1e1",
        "#a4de6c", "#c4e2f0", "#e82c8b", "#f44336" // poți adăuga mai multe culori
    ];


    const fetchPatiets = async ()=> {
        try{
            const token = localStorage.getItem("token");

            const response = await axios.get('http://localhost:8080/api/admin/patient/get-patients', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            console.log(data);
            setPatients(data); // Stocăm datele brute
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get('http://localhost:8080/api/admin/appointment/get-appointments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            console.log(data);
            setData(data); // Stocăm datele brute
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchPatiets();
    }, []);


    const pacientiCnp = patients.map(patient => patient.cnp);
    const cnpProgramari = data.map(appointment => appointment.patientCnp);
    const pacientiCuProgramari = pacientiCnp.filter(cnp => cnpProgramari.includes(cnp));


    const allKids = patients.filter(patient => patient.parent!==null)
    const kidsCnp = allKids.map(kid => kid.cnp)
    const kidsCuProgramari = kidsCnp.filter(cnp => cnpProgramari.includes(cnp));

    console.log(allKids)

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number); // Extragem ziua, luna și anul
        return new Date(year, month - 1, day); // Cream un obiect Date (lunile sunt indexate de la 0)
    };
    const formatDate = (dateString) => {
        return dateString.split(" ")[0]; // Extrage doar data (fără oră)
    };

    // Formatăm data și filtrăm automat când se schimbă intervalul
    useEffect(() => {

        const filtered = data
            .filter((appointment) => {
                const parseAppointmentDate = parseDate(formatDate(appointment.date));
                return parseAppointmentDate >= startDate && parseAppointmentDate <= endDate;
            })
        setFilteredData(filtered);
        const groupedData = filtered.reduce((acc, appointment) => {
            const appointmentDate = formatDate(appointment.date);
            if (!acc[appointmentDate]) {
                acc[appointmentDate] = 0;
            }
            acc[appointmentDate]++;
            return acc;
        }, {});

        const chartDataArray = Object.keys(groupedData).map((date) => ({
            date,
            programari: groupedData[date],
        }));

        setChartData(chartDataArray);
    }, [startDate, endDate, data]);
    useEffect(() => {

        const filteredService = data
            .filter((appointment) => {
                const parseAppointmentDate = parseDate(formatDate(appointment.date));
                return parseAppointmentDate >= startDateService && parseAppointmentDate <= endDateService;
            })
        setFilteredDataService(filteredService);
        const groupedByService = filteredService.reduce((acc, appointment) => {
            const appointmentReason= formatDate(appointment.appointmentReason);
            if (!acc[appointmentReason]) {
                acc[appointmentReason] = 0;
            }
            acc[appointmentReason]++;
            return acc;
        }, {});

        const serviceChartData = Object.keys(groupedByService).map((service) => ({
            name: service,
            value: groupedByService[service],
        }));

        setChartDataService(serviceChartData);
    }, [startDateService, endDateService, data]);

    const getDayDifference = (start, end) => {
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Transformăm milisecunde în zile
        //nr total de pacienti dintre care nr celor care si-au facut cel putin o data o programare, nr de femei, nr de barbati, nr de cpoii
    };

    return (
        <div>
            <div className={styles["appointments-section"]}>
                <div className={styles['appointments']}>
                    <h1>Activitatea Cabinetului</h1>
                    <div>
                        <label>De la:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                        <label>Până la:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div style={{backgroundColor: "white",padding: "20px", borderRadius: "8px"}}>
                    {filteredData.length > 0 ? (
                        <BarChart width={500} height={300} data={chartData}>
                            <XAxis
                                dataKey="date"
                                tickFormatter={(tick, index) => {
                                    const dayDifference = getDayDifference(startDate, endDate);
                                    return dayDifference > 15 && index % 2 !== 0 ? "" : tick;
                                }}
                            />
                            <YAxis
                                domain={[0, "dataMax"]} // Domeniul începe de la 0 și crește în funcție de datele maxime
                                allowDecimals={false} // Doar numere întregi
                            />
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="programari" fill="#8884d8"/>
                        </BarChart>
                    ) : (
                        <p>Nu există programari în intervalul selectat.</p>
                    )}
                </div>
                </div>
                <div className={styles['appointment-reasons']}>
                <h1>Tipul serviciului</h1>
                <div>
                    <label>De la:</label>
                    <DatePicker
                        selected={startDateService}
                        onChange={(date) => setStartDateService(date)}
                        dateFormat="dd/MM/yyyy"
                    />
                    <label>Până la:</label>
                    <DatePicker
                        selected={endDateService}
                        onChange={(date) => setEndDateService(date)}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
                    {filteredDataService.length > 0 ? (
                        <PieChart width={300} height={300}>
                            <Pie
                                data={chartDataService}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                label
                            >
                                {chartDataService.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={serviceColors[index % serviceColors.length]} // Atribuim culoarea din array
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    ) : (
                        <p>Nu există programari în intervalul selectat.</p>
                    )}
                </div>
            </div>
            </div>
            <div className={styles["patients-section"]}>
                <h2 className={styles["patients-title"]}>Detalii pacienti</h2>
                <div className={styles['patients']}>
                    <div className={styles['total_number_users']}>
                        <div className={styles["item-nr"]}>
                            <p className={styles["item-nr-title"]}>Numar total de pacienti</p>
                            <p className={styles["item-nr-result"]}>{pacientiCnp.length}</p>
                        </div>
                        <div className={styles["items"]}>
                            <div className={styles["item"]}>
                                <img className={styles['img']} src={kidImg}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Copii </p>
                                    <p className={styles["item-result"]}>{kidsCnp.length}</p>
                                    <p className={styles["item-precent"]}> {kidsCnp.length / pacientiCnp.length * 100}%</p>

                                </div>
                            </div>

                            <div className={styles["item"]}>
                                <img className={styles['img']} src={adults}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Adulti</p>
                                    <p className={styles["item-result"]}>{pacientiCnp.length - kidsCnp.length}</p>
                                    <p className={styles["item-precent"]}> {(pacientiCnp.length - kidsCnp.length) / pacientiCnp.length * 100}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['appointment_patients']}>
                        <div className={styles["item-nr"]}>
                            <p className={styles["item-nr-title"]}>Pacienti cu cel putin o programare</p>
                            <p className={styles["item-nr-result"]}> {pacientiCuProgramari.length}</p>
                        </div>
                        <div className={styles["items"]}>
                            <div className={styles["item"]}>
                                <img className={styles['img']} src={kidImg}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Copii </p>
                                    <p className={styles["item-result"]}>{kidsCuProgramari.length}</p>
                                    <p className={styles["item-precent"]}> {kidsCuProgramari.length /pacientiCuProgramari.length*100}%</p>
                                </div>
                            </div>

                            <div className={styles["item"]}>
                                <img className={styles['img']} src={adults}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Adulti </p>
                                    <p className={styles["item-result"]}>{pacientiCuProgramari.length - kidsCuProgramari.length}</p>
                                    <p className={styles["item-precent"]}> {(pacientiCuProgramari.length - kidsCuProgramari.length)/ pacientiCuProgramari.length * 100}%</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CabActivity;
