import RecentApplications from './RecentApplications';
import QuickActions from './QuickActions';
import SystemStatus from './SystemStatus';

const ApplicationsOverview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RecentApplications />
      </div>
      <div className="space-y-6">
        <QuickActions />
        <SystemStatus />
      </div>
    </div>
  );
};

export default ApplicationsOverview;
