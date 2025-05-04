package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.repository.PatientPersonalDataRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientPersonalDataServiceImplTest {

    private PatientPersonalDataRepository personalDataRepository;
    private PatientRepository patientRepository;
    private PatientPersonalDataServiceImpl service;

    @BeforeEach
    void setUp() {
        personalDataRepository = mock(PatientPersonalDataRepository.class);
        patientRepository = mock(PatientRepository.class);
        service = new PatientPersonalDataServiceImpl(personalDataRepository, patientRepository);
    }

    @Test
    void testSavePatientPersonalData() {
        PersonalDataDto dto = new PersonalDataDto();
        dto.setCnpPatient("1234567890123");

        Patient patient = new Patient();
        when(patientRepository.getPatientByCNP("1234567890123")).thenReturn(Optional.of(patient));
        when(personalDataRepository.save(any(PatientPersonalData.class)))
                .thenReturn(new PatientPersonalData());

        PatientPersonalData result = service.savePatientPersonalData(dto);

        assertNotNull(result);
    }

    @Test
    void testUpdatePatientPersonalData() {
        PersonalDataDto dto = new PersonalDataDto();
        dto.setCnpPatient("1234567890123");

        Patient patient = new Patient();
        PatientPersonalData existingData = new PatientPersonalData();

        when(patientRepository.getPatientByCNP("1234567890123")).thenReturn(Optional.of(patient));
        when(personalDataRepository.getPatientPersonalDataByPatient(patient)).thenReturn(Optional.of(existingData));

        service.updatePatientPersonalData(dto);

        verify(personalDataRepository).save(existingData);
    }
}

