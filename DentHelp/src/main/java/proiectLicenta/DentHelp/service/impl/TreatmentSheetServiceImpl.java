package proiectLicenta.DentHelp.service.impl;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.TreatmentSheetDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.TreatmentSheet;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.TreatmentSheetRepository;
import proiectLicenta.DentHelp.service.TreatmentSheetService;

import java.util.Optional;

@Service
public class TreatmentSheetServiceImpl implements TreatmentSheetService {

    private final TreatmentSheetRepository treatmentSheetRepository;
    private final AppointmentRepository appointmentRepository;

    public TreatmentSheetServiceImpl(TreatmentSheetRepository treatmentSheetRepository, AppointmentRepository appointmentRepository) {
        this.treatmentSheetRepository = treatmentSheetRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public TreatmentSheet getTreatmentSheet(Long appointmentId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(appointmentId);
        Appointment appointment;
        if(optionalAppointment.isPresent()){
            appointment = optionalAppointment.get();
            TreatmentSheet treatmentSheet= new TreatmentSheet();
            Optional<TreatmentSheet> optionalTreatmentSheet = treatmentSheetRepository.getTreatmentSheetByAppointment(appointment);

            if(optionalTreatmentSheet.isPresent())
            {
                treatmentSheet = optionalTreatmentSheet.get();
                return treatmentSheet;
            }
        }
        return null;
    }

    public int saveTreatmentSheet(@RequestBody TreatmentSheetDto treatmentSheetDto){

        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(treatmentSheetDto.getAppointmentId());
        Appointment appointment;

        if(optionalAppointment.isPresent()){

            appointment = optionalAppointment.get();

            Optional<TreatmentSheet> optionalTreatmentSheet = treatmentSheetRepository.getTreatmentSheetByAppointment(appointment);
            TreatmentSheet treatmentSheet = new TreatmentSheet();

            if(!optionalTreatmentSheet.isPresent()){
                treatmentSheet.setMedication(treatmentSheetDto.getMedication());
                treatmentSheet.setAppointmentObservations(treatmentSheetDto.getAppointmentObservations());
                treatmentSheet.setRecommendations(treatmentSheetDto.getRecommendations());
                treatmentSheet.setAppointment(appointment);
                treatmentSheetRepository.save(treatmentSheet);
                return 0;
            }
        }
        return 1;
    }

    public void updateTreatmentSheet(@RequestBody TreatmentSheetDto treatmentSheetDto){

        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(treatmentSheetDto.getAppointmentId());
        Appointment appointment;

        if(optionalAppointment.isPresent()){
            appointment = optionalAppointment.get();

            Optional<TreatmentSheet> optionalTreatmentSheet = treatmentSheetRepository.getTreatmentSheetByAppointment(appointment);
            TreatmentSheet treatmentSheet;

            if(optionalTreatmentSheet.isPresent()){
                treatmentSheet = optionalTreatmentSheet.get();
                treatmentSheet.setMedication(treatmentSheetDto.getMedication());
                treatmentSheet.setAppointmentObservations(treatmentSheetDto.getAppointmentObservations());
                treatmentSheet.setRecommendations(treatmentSheetDto.getRecommendations());
                treatmentSheet.setAppointment(appointment);
                treatmentSheetRepository.save(treatmentSheet);
            }
        }
    }

}
