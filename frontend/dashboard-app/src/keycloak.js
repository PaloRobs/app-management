import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8090',
  realm: 'dashboard',
  clientId: 'dashboard-frontend'
});

export default keycloak;
