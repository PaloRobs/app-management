class AuthService {
  constructor() {
    this.keycloakUrl = 'http://localhost:8090';
    this.realm = 'dashboard';
    this.clientId = 'dashboard-frontend';
    this.clientSecret = 'dashboard-frontend-secret';
  }

  /**
   * Login utente usando Resource Owner Password Credentials Grant
   */
  async login(username, password) {
    try {
      const response = await fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: username,
          password: password,
          scope: 'openid profile email'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Login fallito');
      }

      const tokens = await response.json();
      
      // Salva i token nel localStorage
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('id_token', tokens.id_token);
      
      return tokens;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Registrazione utente usando Keycloak Admin REST API
   */
  async register(userData) {
    try {
      // Ottieni token admin per creare l'utente
      const adminToken = await this.getAdminToken();
      
      // Crea l'utente tramite Admin REST API
      const createUserResponse = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          enabled: true,
          emailVerified: true,
          credentials: [{
            type: 'password',
            value: userData.password,
            temporary: false
          }],
          attributes: {
            department: [userData.department],
            created_by: ['self-registration']
          }
        })
      });

      if (createUserResponse.status === 201) {
        // Utente creato con successo, ora assegna il ruolo
        const locationHeader = createUserResponse.headers.get('Location');
        const userId = locationHeader.split('/').pop();
        
        // Assegna ruolo DEVELOPER di default
        await this.assignRoleToUser(userId, 'DEVELOPER', adminToken);
        
        return { success: true };
      } else if (createUserResponse.status === 409) {
        throw new Error('Username o email già esistenti');
      } else {
        const error = await createUserResponse.json();
        throw new Error(error.errorMessage || 'Registrazione fallita');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Ottiene token amministrativo per operazioni Admin API
   */
  async getAdminToken() {
    try {
      // Usa Service Account del client per ottenere token admin
      const response = await fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'openid profile'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get admin token');
      }

      const tokens = await response.json();
      return tokens.access_token;
    } catch (error) {
      console.error('Admin token error:', error);
      throw error;
    }
  }

  /**
   * Assegna un ruolo a un utente
   */
  async assignRoleToUser(userId, roleName, adminToken) {
    try {
      // Prima ottieni l'ID del ruolo
      const rolesResponse = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const roles = await rolesResponse.json();
      const role = roles.find(r => r.name === roleName);
      
      if (!role) {
        throw new Error(`Ruolo ${roleName} non trovato`);
      }

      // Assegna il ruolo all'utente
      const assignRoleResponse = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify([{
          id: role.id,
          name: role.name
        }])
      });

      if (!assignRoleResponse.ok) {
        throw new Error('Errore nell\'assegnazione del ruolo');
      }
    } catch (error) {
      console.error('Assign role error:', error);
      throw error;
    }
  }

  /**
   * Refresh del token di accesso
   */
  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokens = await response.json();
      
      // Aggiorna i token nel localStorage
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      if (tokens.id_token) {
        localStorage.setItem('id_token', tokens.id_token);
      }
      
      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * Logout utente e revoca dei token
   */
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        // Revoca il refresh token
        await fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: refreshToken
          })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Pulisci il localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
  }

  /**
   * Ottiene informazioni utente dal token JWT
   */
  getUserInfo() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      // Decodifica il JWT token per ottenere le info utente
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.preferred_username,
        email: payload.email,
        name: payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        roles: payload.realm_access?.roles || [],
        sessionState: payload.session_state,
        issuer: payload.iss,
        audience: payload.aud,
        expiration: payload.exp,
        issuedAt: payload.iat
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * Verifica se l'utente è autenticato
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Ottiene le informazioni utente dal server Keycloak
   */
  async getUserProfile() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Aggiorna il profilo utente
   */
  async updateUserProfile(userData) {
    try {
      const token = localStorage.getItem('access_token');
      const userInfo = this.getUserInfo();
      
      if (!token || !userInfo) {
        throw new Error('User not authenticated');
      }

      // Ottieni token admin per aggiornare l'utente
      const adminToken = await this.getAdminToken();

      const response = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users/${userInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          attributes: {
            department: [userData.department]
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  /**
   * Cambia password utente
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('access_token');
      const userInfo = this.getUserInfo();
      
      if (!token || !userInfo) {
        throw new Error('User not authenticated');
      }

      // Prima verifica la password attuale facendo login
      try {
        await this.login(userInfo.username, currentPassword);
      } catch (error) {
        throw new Error('Password attuale non corretta');
      }

      // Ottieni token admin per cambiare la password
      const adminToken = await this.getAdminToken();

      const response = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users/${userInfo.id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          type: 'password',
          value: newPassword,
          temporary: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Ottiene tutti gli utenti (solo per admin)
   */
  async getUsers(params = {}) {
    try {
      const userInfo = this.getUserInfo();
      if (!userInfo?.roles.includes('ADMIN')) {
        throw new Error('Access denied: Admin role required');
      }

      const adminToken = await this.getAdminToken();
      
      const queryParams = new URLSearchParams({
        first: params.offset || 0,
        max: params.limit || 10,
        search: params.search || ''
      });

      const response = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  /**
   * Elimina un utente (solo per admin)
   */
  async deleteUser(userId) {
    try {
      const userInfo = this.getUserInfo();
      if (!userInfo?.roles.includes('ADMIN')) {
        throw new Error('Access denied: Admin role required');
      }

      const adminToken = await this.getAdminToken();

      const response = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Verifica se il token sta per scadere
   */
  isTokenExpiringSoon(minutesThreshold = 5) {
    const token = localStorage.getItem('access_token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;
      return timeUntilExpiry < (minutesThreshold * 60);
    } catch (error) {
      return true;
    }
  }

  /**
   * Rinnova automaticamente il token se necessario
   */
  async ensureValidToken() {
    if (this.isTokenExpiringSoon()) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await this.refreshToken(refreshToken);
        } catch (error) {
          // Se il refresh fallisce, l'utente deve rifare login
          this.logout();
          throw new Error('Session expired, please login again');
        }
      } else {
        throw new Error('No refresh token available');
      }
    }
  }
}

export default new AuthService();
