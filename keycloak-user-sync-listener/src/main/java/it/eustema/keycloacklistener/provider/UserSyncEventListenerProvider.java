package it.eustema.keycloacklistener.provider;


import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.jboss.logging.Logger;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.events.admin.OperationType;
import org.keycloak.events.admin.ResourceType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.UserModel;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.eustema.keycloacklistener.model.UserSyncDto;

public class UserSyncEventListenerProvider implements EventListenerProvider {

    private static final Logger log = Logger.getLogger(UserSyncEventListenerProvider.class);
    
    private final KeycloakSession session;
    private final String userServiceUrl;
    private final ObjectMapper objectMapper;
    private final CloseableHttpClient httpClient;
    
    public UserSyncEventListenerProvider(KeycloakSession session) {
        this.session = session;
        this.userServiceUrl = System.getenv()
            .getOrDefault("USER_SERVICE_URL", "http://gateway:8080/api/v1/users/sync");
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClients.createDefault();
        
        log.infof("UserSyncEventListener initialized - Target URL: %s", userServiceUrl);
    }

    @Override
    public void onEvent(Event event) {
        log.debugf("Received user event: %s for user: %s", event.getType(), event.getUserId());
        
        // Gestisci eventi di registrazione e modifica profilo
        if (shouldProcessEvent(event.getType())) {
            String operation = determineOperation(event.getType());
            processUserEventAsync(event.getUserId(), operation);
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean includeRepresentation) {
        log.debugf("Received admin event: %s on resource: %s", 
                 adminEvent.getOperationType(), adminEvent.getResourceType());
        
        // Gestisci eventi amministrativi su utenti
        if (adminEvent.getResourceType() == ResourceType.USER) {
            String userId = extractUserIdFromResourcePath(adminEvent.getResourcePath());
            if (userId != null) {
                String operation = mapAdminOperationToSync(adminEvent.getOperationType());
                if (operation != null) {
                    processUserEventAsync(userId, operation);
                }
            }
        }
    }

    private boolean shouldProcessEvent(EventType eventType) {
        return eventType == EventType.REGISTER ||
               eventType == EventType.UPDATE_PROFILE ||
               eventType == EventType.UPDATE_EMAIL ||
               eventType == EventType.VERIFY_EMAIL ||
               eventType == EventType.UPDATE_PASSWORD;
    }

    private String determineOperation(EventType eventType) {
        return switch (eventType) {
            case REGISTER -> "CREATE_OR_UPDATE";
            case UPDATE_PROFILE, UPDATE_EMAIL, VERIFY_EMAIL, UPDATE_PASSWORD -> "CREATE_OR_UPDATE";
            default -> null;
        };
    }

    private String mapAdminOperationToSync(OperationType operationType) {
        return switch (operationType) {
            case CREATE, UPDATE -> "CREATE_OR_UPDATE";
            case DELETE -> "DELETE";
            default -> null;
        };
    }

    private void processUserEventAsync(String userId, String operation) {
        // Esegui la sincronizzazione in modo asincrono per non bloccare Keycloak
        CompletableFuture.runAsync(() -> {
            try {
                syncUserToService(userId, operation);
            } catch (Exception e) {
                log.errorf(e, "Failed to process user event asynchronously for user: %s", userId);
            }
        });
    }

    private void syncUserToService(String userId, String operation) {
        try {
            log.infof("Syncing user %s with operation: %s", userId, operation);
            
            UserModel user = null;
            if (!"DELETE".equals(operation)) {
                user = session.users().getUserById(session.getContext().getRealm(), userId);
                if (user == null) {
                    log.warnf("User not found for ID: %s", userId);
                    return;
                }
            }

            UserSyncDto syncDto = buildUserSyncDto(user, operation, userId);
            sendToUserService(syncDto);
            
            log.infof("Successfully synced user %s to User Service", userId);
            
        } catch (Exception e) {
            log.errorf(e, "Failed to sync user %s to User Service", userId);
            
            // Implementa retry logic se necessario
            scheduleRetry(userId, operation);
        }
    }

    private UserSyncDto buildUserSyncDto(UserModel user, String operation, String userId) {
        UserSyncDto.UserSyncDtoBuilder builder = UserSyncDto.builder()
            .keycloakId(userId)
            .operation(operation);

        if (user != null && !"DELETE".equals(operation)) {
            builder
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .emailVerified(user.isEmailVerified())
                .enabled(user.isEnabled());
        }

        return builder.build();
    }

    private void sendToUserService(UserSyncDto syncDto) throws IOException {
        HttpPost request = new HttpPost(userServiceUrl);
        
        // Configura headers
        request.setHeader("Content-Type", "application/json");
        request.setHeader("Accept", "application/json");
        request.setHeader("User-Agent", "Keycloak-UserSync-Listener/1.0");
        
        // Serializza il DTO in JSON
        String jsonPayload = objectMapper.writeValueAsString(syncDto);
        request.setEntity(new StringEntity(jsonPayload, StandardCharsets.UTF_8));
        
        log.debugf("Sending sync request: %s", jsonPayload);
        
        try (CloseableHttpResponse response = httpClient.execute(request)) {
            int statusCode = response.getStatusLine().getStatusCode();
            
            if (statusCode >= 200 && statusCode < 300) {
                log.debugf("User sync successful - HTTP %d", statusCode);
            } else {
                log.errorf("User sync failed - HTTP %d: %s", 
                          statusCode, response.getStatusLine().getReasonPhrase());
                throw new IOException("HTTP error: " + statusCode);
            }
        }
    }

    private String extractUserIdFromResourcePath(String resourcePath) {
        // ResourcePath format: "users/{userId}" o "users/{userId}/..."
        if (resourcePath != null && resourcePath.startsWith("users/")) {
            String[] parts = resourcePath.split("/");
            if (parts.length >= 2) {
                return parts[1];
            }
        }
        return null;
    }

    private void scheduleRetry(String userId, String operation) {
        // Implementazione semplificata - in produzione potresti usare un sistema di retry più sofisticato
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(5000); // Attendi 5 secondi
                log.infof("Retrying sync for user: %s", userId);
                syncUserToService(userId, operation);
            } catch (Exception e) {
                log.errorf(e, "Retry failed for user: %s", userId);
            }
        });
    }

    @Override
    public void close() {
        try {
            if (httpClient != null) {
                httpClient.close();
            }
        } catch (IOException e) {
            log.error("Error closing HTTP client", e);
        }
    }
}
