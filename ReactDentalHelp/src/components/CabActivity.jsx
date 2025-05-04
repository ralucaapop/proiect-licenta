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
        "#0b1d3a", "#34bda5", "#ffc658", "#fc9077", "#e0f7fa", "#8dd1e1",
        "#a4de6c", "#c4e2f0", "#e82c8b", "#f44336",  "#a2de6c", "#e92c8b", "#f84336"
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
            setData(data);
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


    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number); // Extragem ziua, luna și anul
        return new Date(year, month - 1, day); // Cream un obiect Date (lunile sunt indexate de la 0)
    };
    const formatDate = (dateString) => {
        return dateString.split(" ")[0];
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
            const appointmentReason= appointment.appointmentReason
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
    };

    return (
        <div>
            <div className={styles["appointments-section"]}>
                <div className={styles['appointments']}>
                    <h1>Activitatea Cabinetului</h1>
                    <div>
                        <p>De la:</p>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                        <p>Până la:</p>
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
                                domain={[0, "dataMax"]}
                                allowDecimals={false}
                            />
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="programari" fill="#283b53"/>
                        </BarChart>
                    ) : (
                        <p>Nu există programari în intervalul selectat.</p>
                    )}
                </div>
                </div>
                <div className={styles['appointment-reasons']}>
                    <h1>Tipul serviciului</h1>
                    <div>
                        <p>De la:</p>
                        <DatePicker
                            selected={startDateService}
                            onChange={(date) => setStartDateService(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                        <p>Până la:</p>
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
                                            fill={serviceColors[index % serviceColors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />

                            </PieChart>
                        ) : (
                            <p>Nu există programari în intervalul selectat.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["patients-section"]}>
                <h2 className={styles["patients-title"]}>Detalii pacienți</h2>
                <div className={styles['patients']}>
                    <div className={styles['total_number_users']}>
                        <div className={styles["item-nr"]}>
                            <p className={styles["item-nr-title"]}>Număr total de pacienți</p>
                            <p className={styles["item-nr-result"]}>{pacientiCnp.length}</p>
                        </div>
                        <div className={styles["items"]}>
                            <div className={styles["item"]}>
                                <img className={styles['img']} src={kidImg}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Copii </p>
                                    <p className={styles["item-result"]}>{kidsCnp.length}</p>
                                    <p className={styles["item-precent"]}> {(kidsCnp.length / pacientiCnp.length * 100).toFixed(2)}%</p>

                                </div>
                            </div>

                            <div className={styles["item"]}>
                                <img className={styles['img']} src={adults}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Adulți</p>
                                    <p className={styles["item-result"]}>{pacientiCnp.length - kidsCnp.length}</p>
                                    <p className={styles["item-precent"]}> {((pacientiCnp.length - kidsCnp.length) / pacientiCnp.length * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['appointment_patients']}>
                        <div className={styles["item-nr"]}>
                            <p className={styles["item-nr-title"]}>Pacienți cu cel puțin o programare</p>
                            <p className={styles["item-nr-result"]}> {pacientiCuProgramari.length}</p>
                        </div>
                        <div className={styles["items"]}>
                            <div className={styles["item"]}>
                                <img className={styles['img']} src={kidImg}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Copii </p>
                                    <p className={styles["item-result"]}>{kidsCuProgramari.length}</p>
                                    <p className={styles["item-precent"]}> {(kidsCuProgramari.length / pacientiCuProgramari.length * 100).toFixed(2)}%</p>
                                </div>
                            </div>

                            <div className={styles["item"]}>
                                <img className={styles['img']} src={adults}/>
                                <div className={styles["item-content"]}>
                                    <p className={styles["item-title"]}> Adulți </p>
                                    <p className={styles["item-result"]}>{pacientiCuProgramari.length - kidsCuProgramari.length}</p>
                                    <p className={styles["item-precent"]}> {((pacientiCuProgramari.length - kidsCuProgramari.length)/ pacientiCuProgramari.length * 100).toFixed(2)}%</p>

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
