package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="appointments_requests")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AppointmentRequest {
    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    private Long appointmentRequestId;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name ="fk_cnp")
    private Patient patient;
    private String appointmentReason;
    private String desiredAppointmentTime;
    private String requestDate;

}
