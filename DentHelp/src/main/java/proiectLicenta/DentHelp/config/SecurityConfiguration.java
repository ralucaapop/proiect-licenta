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
                        .requestMatchers("/api/auth/register/verification").permitAll()// Permite accesul la autentificare și înregistrare
                        .requestMatchers("/api/in/appointment_request").hasAuthority("PATIENT")
                        .requestMatchers("api/in/general-anamnesis/add-general-anamnesis-patient").hasAuthority("PATIENT")
                        .requestMatchers("api/in/general-anamnesis/get-general-anamnesis/**").permitAll()
                        .requestMatchers("api/in/general-anamnesis/update-general-anamnesis").permitAll()
                        .requestMatchers("/api/patient/appointments/get-patient-appointments").permitAll()
                        .requestMatchers("/api/admin/patients/medical-record/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/appointment/get-appointments").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/appointment/make-appointment").hasAuthority("ADMIN")
                        .requestMatchers("api/admin/confirm-appointments/**").hasAuthority("ADMIN")
                        .requestMatchers("api/admin/patient/get-patients").hasAuthority("ADMIN")
                        .requestMatchers("api/admin/patient/get-patient-personal-data/**").hasAuthority("ADMIN")
                        .requestMatchers("api/in/treatment-sheet/get-treatment-sheet/**").permitAll()
                        .requestMatchers("api/in/treatment-sheet/update-sheet-treatment/**").hasAuthority("ADMIN")
                        .requestMatchers("api/in/treatment-sheet/save-treatment-sheet").hasAuthority("ADMIN")
                        .requestMatchers("api/patient/xray/save-xray").permitAll()
                        .requestMatchers("api/patient/xray/get-patient-xrays/**").permitAll()
                        .requestMatchers("/api/patient/xray/**").permitAll()
                        .anyRequest().authenticated()  // Orice alt request trebuie autentificat
                )
                .sessionManagement(sessionManagement ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
