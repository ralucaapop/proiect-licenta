package proiectLicenta.DentHelp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
@EnableScheduling

public class DentHelpApplication {

	public static void main(String[] args) {
		SpringApplication.run(DentHelpApplication.class, args);
	}
	@GetMapping
	public String hello(){
		return "Hello";
	}
}
