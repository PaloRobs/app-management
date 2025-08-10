import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { LogOut, User } from 'lucide-react';

const Header = ({ userInfo }) => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              <i className="fas fa-desktop text-blue-600 mr-2"></i>
              Dashboard Applicazioni
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <i className="fas fa-plus mr-2"></i>Nuova Applicazione
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="w-6 h-6 mr-2" />
                <span className="hidden md:block">{userInfo.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{userInfo.name}</div>
                    <div className="text-gray-500">{userInfo.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Ruoli: {userInfo.roles.filter(role => ['ADMIN', 'DEVELOPER', 'REFERENT', 'VIEWER'].includes(role)).join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
