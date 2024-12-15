package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.MedicalReportDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.MedicalReport;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.MedicalReportRepository;
import proiectLicenta.DentHelp.service.MedicalReportService;

import java.util.Optional;


@Service
public class MedicalReportServiceImpl implements MedicalReportService {

    private final MedicalReportRepository medicalReportRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public MedicalReportServiceImpl(MedicalReportRepository medicalReportRepository, AppointmentRepository appointmentRepository) {
        this.medicalReportRepository = medicalReportRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public MedicalReport addNewMedicalReport(MedicalReportDto medicalReportDto) {
        MedicalReport medicalReport = new MedicalReport();
        medicalReport.setMedication(medicalReportDto.getMedication());
        medicalReport.setTreatmentDetails(medicalReportDto.getTreatmentDetails());
        medicalReport.setDate(medicalReportDto.getDate());
        medicalReport.setHour(medicalReportDto.getHour());

        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(medicalReportDto.getAppointment_id());
        Appointment appointment;
        if(optionalAppointment.isPresent())
            appointment = optionalAppointment.get();
        else{ // this should never be reached
            appointment = new Appointment();
        }
        medicalReport.setAppointment(appointment);
        return medicalReportRepository.save(medicalReport);

    }
}
