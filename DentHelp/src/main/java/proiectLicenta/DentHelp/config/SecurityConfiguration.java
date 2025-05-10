package proiectLicenta.DentHelp.config;

import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("api/auth/forgot-password/**").permitAll()
                        .requestMatchers("api/in/appointment/saveAppointmentAnamnesis").permitAll()
                        .requestMatchers("api/in/appointment/getAnamnesisAppointment/**").permitAll()
                        .requestMatchers("api/auth/register/kid").permitAll()
                        .requestMatchers("/api/admin/patient/get-kids/**").permitAll()
                        .requestMatchers("/api/auth/register/verification").permitAll()
                        .requestMatchers("/api/in/appointment_request/**").hasAuthority("PATIENT")
                        .requestMatchers("/api/in/appointment_request/get_patient_requests/**").hasAuthority("PATIENT")
                        .requestMatchers("/api/in/appointment_request/delete_request/**").hasAuthority("PATIENT")
                        .requestMatchers("/api/in/appointment_request/update_request/**").hasAuthority("PATIENT")
                        .requestMatchers("api/in/general-anamnesis/add-general-anamnesis-patient").hasAuthority("PATIENT")
                        .requestMatchers("api/in/general-anamnesis/get-general-anamnesis/**").permitAll()
                        .requestMatchers("api/in/general-anamnesis/update-general-anamnesis").permitAll()
                        .requestMatchers("/api/patient/appointments/get-patient-appointments").permitAll()
                        .requestMatchers("/api/admin/patients/medical-record/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/appointment/get-appointments").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/appointment/make-appointment").hasAuthority("ADMIN")
                        .requestMatchers("api/admin/confirm-appointments/**").hasAuthority("ADMIN")
                        .requestMatchers("api/admin/patient/get-patients").hasAnyAuthority("ADMIN", "RADIOLOGIST")
                        .requestMatchers("api/admin/patient/get-patient-personal-data/**").hasAuthority("ADMIN")
                        .requestMatchers("api/in/treatment-sheet/get-treatment-sheet/**").permitAll()
                        .requestMatchers("api/in/treatment-sheet/update-sheet-treatment/**").hasAuthority("ADMIN")
                        .requestMatchers("api/in/treatment-sheet/save-treatment-sheet").hasAuthority("ADMIN")
                        .requestMatchers("api/patient/xray/save-xray").permitAll()
                        .requestMatchers("api/patient/xray/get-patient-xrays/**").permitAll()
                        .requestMatchers("/api/patient/xray/**").permitAll()
                        .requestMatchers("/api/in/notifications/admin/read_notification/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/notifications/admin/delete_notification/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/notifications/admin/send_notification/late_appointment/**").hasAuthority("PATIENT")
                        .requestMatchers("/api/in/notifications/admin/send_notification/cancel_appointment/**").hasAuthority("PATIENT")
                        .requestMatchers("/api/in/notifications/admin/get_notifications/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/get_patient_tooth_history/**").permitAll()
                        .requestMatchers("/api/in/teeth/get_patient_all_tooth_history/**").permitAll()
                        .requestMatchers("/api/in/teeth/get_patient_all_extracted_tooth/**").permitAll()
                        .requestMatchers("/api/in/teeth/addNewIntervention").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/editIntervention/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/deleteIntervention/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/deleteExtraction/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/chatbot/ask").hasAuthority("PATIENT")
                        .requestMatchers("/api/in/teeth/problems/deleteProblem/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/problems/addNewProblem").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/problems/editProblem/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/in/teeth/problems/get_patient_tooth_problems/**").permitAll()
                        .requestMatchers("/api/in/teeth/problems/get_patient_all_tooth_problems/**").permitAll()
                        .requestMatchers("/api/admin/patient/addPatient").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/patient/update-patient-information/**").permitAll()
                        .requestMatchers("/api/admin/patient/change-radiologist-to-patient/**").permitAll()
                        .requestMatchers("/api/admin/patient/change/kid-to-patient/**").hasAuthority("PATIENT")
                        .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
