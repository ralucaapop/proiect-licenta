import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../assets/css/PatientRadiography.module.css';
import radiographyPhoto from "../../assets/radiography_photo/radiography.png";

function PatientRadiography(props) {
    const [radiographs, setRadiographs] = useState([]);
    const [selectedRadiograph, setSelectedRadiograph] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Stare pentru modal imagine
    const [newRadiograph, setNewRadiograph] = useState({
        date: '',
        observations: '',
        file: null,
    });
    const [editRadiograph, setEditRadiograph] = useState({
        observations: '',
        file: null,
    });

    const getPatientRadiographies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/patient/xray/get-patient-xrays/${props.cnp}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data.data;
                console.log(data)
                setRadiographs(data);
            }
        } catch (error) {
            console.error('Eroare la preluarea radiografiilor pacientului', error);
        }
    };

    useEffect(() => {
        getPatientRadiographies();
    }, [props.cnp]);

    const handleRadiographClick = (radiograph) => {
        setSelectedRadiograph(radiograph);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (radiograph) => {
        setEditRadiograph({
            observations: radiograph.observations,
            file: radiograph.file,
        });
        setSelectedRadiograph(radiograph);
        setIsEditModalOpen(true);
    };


    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleFileChange = (e, isEdit = false) => {
        if (isEdit) {
            setEditRadiograph({ ...editRadiograph, file: e.target.files[0] });
        } else {
            setNewRadiograph({ ...newRadiograph, file: e.target.files[0] });
        }
    };

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditRadiograph({ ...editRadiograph, [name]: value });
        } else {
            setNewRadiograph({ ...newRadiograph, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('date', new Date().toISOString().split('T')[0]);
            formData.append('observations', newRadiograph.observations);
            formData.append('cnpPatient', props.cnp);
            formData.append('file', newRadiograph.file); // Adăugăm fișierul

            const response = await axios.post(
                `http://localhost:8080/api/patient/xray/save-xray`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Asigură-te că trimiti ca form-data
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            if (response.status === 200) {
                closeAddModal();
                setNewRadiograph({
                    observations: '',
                    file: null
                });
                getPatientRadiographies();
            }
        } catch (error) {
            console.error('Eroare la adăugarea radiografiei', error);
        }
    };


    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('observations', editRadiograph.observations || selectedRadiograph.observations);
            if (editRadiograph.file) {
                formData.append('file', editRadiograph.file);
            }

            const response = await axios.put(
                `http://localhost:8080/api/patient/xray/update-xray/${selectedRadiograph.xrayId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',  // Important pentru încărcarea fișierului
                    },
                }
            );

            if (response.status === 200) {
                closeEditModal();

                // Obține din nou lista de radiografii pentru a reflecta modificările
                await getPatientRadiographies();
                alert(
                    "Radiografie editata"
                )
                setSelectedRadiograph(null)
            }

        } catch (error) {
            console.error('Eroare la actualizarea radiografiei', error);
        }
    };


    const getImageUrl = (filePath) => {
        console.log(filePath)
        return filePath.startsWith('http')
            ? filePath  // URL extern, îl folosim direct
            : `http://localhost:5173/${filePath}`;  // URL local, adaugă domeniul serverului tău
    };

    const openImageModal = () => {
        setIsImageModalOpen(true); // Deschide modalul pentru imagine
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false); // Închide modalul pentru imagine
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <p>Radiografiile pacientului</p>
                <div className={styles.radiographsList}>
                    {radiographs.length > 0 ? (
                        radiographs.map((radiograph) => (
                            <div
                                key={radiograph.xrayId}
                                className={styles.radiographItem}
                                onClick={() => handleRadiographClick(radiograph)}
                            >
                                <img
                                    src={radiographyPhoto}
                                    alt={`Radiografia din ${radiograph.date}`}
                                    className={styles["radiographImage"]}
                                />
                                <p className={styles.radiographDate}>Data: {radiograph.date}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nicio radiografie disponibilă</p>
                    )}
                </div>

                {/* Button to open Add Modal */}
                <button className={styles.addButton} onClick={openAddModal}>
                    Adaugă Radiografie Nouă
                </button>
            </div>

            <div className={styles.rightSide}>
                {selectedRadiograph ? (
                    <div className={styles.radiographDetails}>
                        <h3>Detalii Radiografie</h3>
                        <img
                            src={getImageUrl(selectedRadiograph.filePath)}
                            alt={`Radiografia din ${selectedRadiograph.date}`}
                            className={styles.radiographImage}
                            onClick={openImageModal}
                        />
                        <p><strong>Data:</strong> {selectedRadiograph.date}</p>
                        <p><strong>Observații:</strong> {selectedRadiograph.observations || 'Nicio observație disponibilă'}</p>
                        <button onClick={() => openEditModal(selectedRadiograph)}>Editează</button>
                    </div>
                ) : (
                    <p>Selectați o radiografie pentru a vedea detaliile.</p>
                )}
            </div>

            {/* Modal for Adding New Radiograph */}
            {isAddModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Adaugă Radiografie Nouă</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Observații:
                                <textarea
                                    name="observations"
                                    value={newRadiograph.observations}
                                    onChange={e => handleInputChange(e)}
                                />
                            </label>
                            <label>
                                Imagine Radiografie:
                                <input type="file" name="file" onChange={e => handleFileChange(e)}  />
                            </label>
                            <button type="submit" className={styles.submitButton}>Trimite</button>
                            <button type="button" className={styles.closeButton} onClick={closeAddModal}>
                                Închide
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Editing Existing Radiograph */}
            {isEditModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Editează Radiografie</h2>
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                Observații:
                                <textarea
                                    name="observations"
                                    value={editRadiograph.observations}  // Setăm valoarea curentă din starea `editRadiograph`
                                    onChange={e => handleInputChange(e, true)}  // Permitem modificarea observației
                                    required
                                />
                            </label>
                            <label>
                                Imagine Radiografie:
                                <input type="file" name="file" onChange={e => handleFileChange(e, true)} />
                            </label>
                            <button type="submit" className={styles.submitButton}>Salvează Modificările</button>
                            <button type="button" className={styles.closeButton} onClick={closeEditModal}>
                                Închide
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal pentru afișarea imaginii mărite */}
            {isImageModalOpen && (
                <div className={styles.modal} onClick={closeImageModal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeButton} onClick={closeImageModal}>&times;</span>
                        <img
                            src={selectedRadiograph.filePath || radiographyPhoto}
                            alt={`Radiografia din ${selectedRadiograph.date}`}
                            className={styles.largeRadiographImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

PatientRadiography.defaultProps = {
    cnp: ""
};

export default PatientRadiography;
