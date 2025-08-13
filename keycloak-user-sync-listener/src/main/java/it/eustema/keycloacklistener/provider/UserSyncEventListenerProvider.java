package it.eustema.keycloacklistener.provider;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.jboss.logging.Logger;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.events.admin.OperationType;
import org.keycloak.events.admin.ResourceType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import com.fasterxml.jackson.databind.JsonNode;
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
            .getOrDefault("USER_SERVICE_URL", "http://user-server:8585/api/v1/users/sync");
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClients.createDefault();
        log.infof("UserSyncEventListener initialized - Target URL: %s", userServiceUrl);
    }

    @Override
    public void onEvent(Event event) {
        log.debugf("Received user event: %s for user: %s", event.getType(), event.getUserId());

        if (shouldProcessEvent(event.getType())) {
            String operation = determineOperation(event.getType());
            // Se la sync fallisce, l'eccezione farà il rollback della transazione di Keycloak.
            syncUserToService(event.getUserId(), operation, event.getRealmId());
        }
    }
    
    // ... (metodo onEvent per AdminEvent, metodi privati e close invariati) ...

    @Override
    public void onEvent(AdminEvent adminEvent, boolean includeRepresentation) {
        log.debugf("Received admin event: %s on resource: %s",
                   adminEvent.getOperationType(), adminEvent.getResourceType());

        if (adminEvent.getResourceType() == ResourceType.USER) {
            String userId = extractUserIdFromResourcePath(adminEvent.getResourcePath());
            if (userId != null) {
                String operation = mapAdminOperationToSync(adminEvent.getOperationType());
                if (operation != null) {
                    syncUserToService(userId, operation, adminEvent.getRealmId());
                }
            }
        }
    }

    private void syncUserToService(String userId, String operation, String realmId) {
        try {
            log.infof("Syncing user %s with operation: %s", userId, operation);
            
            UserModel user = null;
            if (!"DELETE".equals(operation)) {
                RealmModel realm = session.realms().getRealm(realmId);
                if (realm == null) {
                    throw new IllegalStateException("Realm not found for ID: " + realmId);
                }
                user = session.users().getUserById(realm, userId);
                if (user == null) {
                    throw new IllegalStateException("User not found for ID: " + userId);
                }
            }

            UserSyncDto syncDto = buildUserSyncDto(user, operation, userId);
            sendToUserService(syncDto);
            
            log.infof("Successfully synced user %s to User Service", userId);

        } catch (Exception e) {
            log.errorf(e, "Failed to sync user %s to User Service", userId);
            // Lancia un'eccezione per forzare il rollback della transazione.
            // L'eccezione RuntimeException è un'eccezione non controllata che provoca il rollback.
            throw new RuntimeException("User synchronization failed, registration will be aborted.", e);
        }
    }

    // ... (altri metodi privati come buildUserSyncDto, sendToUserService, ecc. invariati) ...
    
    private void sendToUserService(UserSyncDto syncDto) throws IOException {
        String token = getServiceAccountToken();

        HttpPost request = new HttpPost(userServiceUrl); // userServiceUrl dovrebbe puntare al gateway
        
        request.setHeader("Content-Type", "application/json");
        request.setHeader("Accept", "application/json");
        request.setHeader("User-Agent", "Keycloak-UserSync-Listener/1.0");
        request.setHeader("Authorization", "Bearer " + token);

        String jsonPayload = objectMapper.writeValueAsString(syncDto);
        request.setEntity(new StringEntity(jsonPayload, StandardCharsets.UTF_8));

        log.debugf("Sending sync request: %s", jsonPayload);

        try (CloseableHttpResponse response = httpClient.execute(request)) {
            int statusCode = response.getStatusLine().getStatusCode();

            if (statusCode < 200 || statusCode >= 300) {
                throw new IOException("HTTP error: " + statusCode + " - " + response.getStatusLine().getReasonPhrase());
            }
            log.debugf("User sync successful - HTTP %d", statusCode);
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

    private UserSyncDto buildUserSyncDto(UserModel user, String operation, String userId) {
        // ... (implementazione invariata) ...
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
    
    private String extractUserIdFromResourcePath(String resourcePath) {
        if (resourcePath != null && resourcePath.startsWith("users/")) {
            String[] parts = resourcePath.split("/");
            if (parts.length >= 2) {
                return parts[1];
            }
        }
        return null;
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
    
    private String getServiceAccountToken() throws IOException {
        String tokenUrl = "http://keycloak:8090/realms/dashboard/protocol/openid-connect/token";
        String clientId =  "user-sync-client";
        String clientSecret =  "p6KppjtYe0wtxaRcTsNbcGEU0dxmtRSM";

        HttpPost post = new HttpPost(tokenUrl);
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("grant_type", "client_credentials"));
        params.add(new BasicNameValuePair("client_id", clientId));
        params.add(new BasicNameValuePair("client_secret", clientSecret));
        post.setEntity(new UrlEncodedFormEntity(params, StandardCharsets.UTF_8));

        try (CloseableHttpResponse response = httpClient.execute(post)) {
            int status = response.getStatusLine().getStatusCode();
            if (status >= 200 && status < 300) {
                String json = EntityUtils.toString(response.getEntity());
                JsonNode node = objectMapper.readTree(json);
                return node.get("access_token").asText();
            } else {
                throw new IOException("Failed to get token: " + status);
            }
        }
    }
}