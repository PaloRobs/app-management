import { useAuth } from '../contexts/AuthContext'; 
import Header from './Header';
import StatsCards from './StatsCards';
import ChartsSection from './ChartsSection';
import ApplicationsOverview from './ApplicationsOverview';

const Dashboard = () => {
  const { user } = useAuth(); 
  
  const userInfo = {
    name: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User',
    email: user?.email || '',
    roles: user?.roles || []
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Header userInfo={userInfo} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards />
        <ChartsSection />
        <ApplicationsOverview />
      </div>
    </div>
  );
};

export default Dashboard;
