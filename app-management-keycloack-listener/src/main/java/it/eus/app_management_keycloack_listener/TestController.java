package it.eus.app_management_keycloack_listener;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/users")
@Slf4j
public class TestController {
	
	   @PostMapping("/sync")
	    public ResponseEntity<String> syncUserFromKeycloak(@RequestBody UserSyncDto userSyncDto) {
	        log.info("Richiesta di sincronizzazione utente ricevuta per: {}", userSyncDto.getUsername());
            System.out.println("Richiesta di sincronizzazione utente ricevuta per " + userSyncDto.getUsername());
	        try {
	        
	            
	            log.info("Utente {} sincronizzato con successo.", userSyncDto.getUsername());
	            return ResponseEntity.status(HttpStatus.CREATED).body("Utente sincronizzato con successo.");
	        } catch (Exception e) {
	            log.error("Errore durante la sincronizzazione dell'utente {}: {}", userSyncDto.getUsername(), e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nella sincronizzazione dell'utente.");
	        }
	    }
	


}
