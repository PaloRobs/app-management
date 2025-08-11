package it.eustema.keycloacklistener.provider;

import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class UserSyncEventListenerProviderFactory implements EventListenerProviderFactory {

    private static final String PROVIDER_ID = "user-sync-listener";

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new UserSyncEventListenerProvider(session);
    }

    @Override
    public void init(Config.Scope config) {
        // Inizializzazione se necessaria
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // Post-inizializzazione se necessaria
    }

    @Override
    public void close() {
        // Cleanup se necessario
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }
}

