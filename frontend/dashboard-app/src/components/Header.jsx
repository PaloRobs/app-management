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
                className="flex items-center text-gray-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 shadow-sm hover:bg-blue-100 hover:border-blue-400 transition-all font-semibold"
              >
                <User className="w-6 h-6 mr-2 text-blue-600" />
                <span className="hidden md:block text-blue-700 font-bold">{userInfo.name}</span>
              </button>
              {showUserMenu && (
  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border">
    <div className="flex items-center px-4 py-3 border-b">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
        <User className="w-7 h-7 text-blue-600" />
      </div>
      <div>
        <div className="font-semibold text-gray-900 text-base">{userInfo.name}</div>
        <div className="text-xs text-gray-500">{userInfo.email}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {userInfo.roles
            .filter(role => ['ADMIN', 'DEVELOPER', 'REFERENT', 'VIEWER'].includes(role))
            .map(role => (
              <span
                key={role}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold
                  ${
                    role === 'ADMIN'
                      ? 'bg-red-100 text-red-700'
                      : role === 'DEVELOPER'
                      ? 'bg-green-100 text-green-700'
                      : role === 'REFERENT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {role}
              </span>
            ))}
        </div>
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
