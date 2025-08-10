import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const KeycloakProvider = ({ children }) => {
  const initOptions = {
    onLoad: 'check-sso',
    checkLoginIframe: false,
    pkceMethod: 'S256'
  };

  const handleOnEvent = (event, error) => {
    if (event === 'onTokenExpired') {
      keycloak.updateToken(30);
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={handleOnEvent}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default KeycloakProvider;
