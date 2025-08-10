import ApplicationRow from './ApplicationRow';

const RecentApplications = () => {
  const applications = [
    {
      name: 'E-Commerce Portal',
      tech: 'React + Node.js • PostgreSQL',
      icon: 'fas fa-react',
      iconBg: 'bg-blue-600',
      status: 'Attiva',
      statusStyle: 'bg-green-100 text-green-800'
    },
    {
      name: 'CRM System',
      tech: 'Vue.js + Laravel • MySQL',
      icon: 'fas fa-vuejs',
      iconBg: 'bg-green-600',
      status: 'Manutenzione',
      statusStyle: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'Analytics Dashboard',
      tech: 'Angular + .NET Core • SQL Server',
      icon: 'fas fa-angular',
      iconBg: 'bg-purple-600',
      status: 'Attiva',
      statusStyle: 'bg-green-100 text-green-800'
    },
    {
      name: 'ML Pipeline',
      tech: 'Python + Django • MongoDB',
      icon: 'fas fa-python',
      iconBg: 'bg-orange-600',
      status: 'Offline',
      statusStyle: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            <i className="fas fa-list text-blue-600 mr-2"></i>
            Applicazioni Recenti
          </h3>
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Vedi tutte
          </a>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {applications.map((app, index) => (
            <ApplicationRow key={index} {...app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentApplications;
