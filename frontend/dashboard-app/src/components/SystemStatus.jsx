const SystemStatus = () => {
  const statuses = [
    { service: 'API Servizi', status: 'Online', color: 'bg-green-500', textColor: 'text-green-600' },
    { service: 'Database Principale', status: 'Online', color: 'bg-green-500', textColor: 'text-green-600' },
    { service: 'Backup Sistema', status: 'In corso', color: 'bg-yellow-500', textColor: 'text-yellow-600' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <i className="fas fa-heartbeat text-red-600 mr-2"></i>
        Stato Sistema
      </h3>
      <div className="space-y-3">
        {statuses.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{item.service}</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${item.color} rounded-full mr-2`}></div>
              <span className={`text-sm font-medium ${item.textColor}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
