import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Controlla se l'utente è già autenticato al caricamento
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const userInfo = authService.getUserInfo();
        setUser(userInfo);
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    // Setup auto-refresh del token
    const refreshInterval = setInterval(() => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && authService.isAuthenticated()) {
        authService.refreshToken(refreshToken).catch(() => {
          logout();
        });
      }
    }, 4 * 60 * 1000); // Refresh ogni 4 minuti

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const tokens = await authService.login(username, password);
      const userInfo = authService.getUserInfo();
      
      setUser(userInfo);
      setAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login fallito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await authService.register(userData);
      
      return { 
        success: true, 
        message: 'Registrazione completata con successo! Puoi ora effettuare il login.' 
      };
    } catch (error) {
      // Se è un errore CORS ma l'utente potrebbe essere stato creato
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        // Prova a fare login per verificare se l'utente è stato creato
        try {
          const loginResult = await authService.login(userData.username, userData.password);
          if (loginResult) {
            // Login riuscito = utente esisteva = registrazione avvenuta
            const userInfo = authService.getUserInfo();
            setUser(userInfo);
            setAuthenticated(true);
            
            return { 
              success: true, 
              message: 'Registrazione completata! Sei stato automaticamente loggato.',
              autoLogin: true
            };
          }
        } catch (loginError) {
          // Login fallito = utente non esiste = errore reale
          return { 
            success: false, 
            error: 'Errore durante la registrazione. Riprova con dati diversi.' 
          };
        }
      }
      
      return { 
        success: false, 
        error: error.message || 'Registrazione fallita' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setAuthenticated(false);
    setLoading(false);
  };

  const value = {
    user,
    authenticated,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
