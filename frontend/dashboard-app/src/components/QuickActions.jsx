const QuickActions = () => {
  const actions = [
    { icon: 'fas fa-plus-circle text-blue-600', label: 'Registra Nuova App' },
    { icon: 'fas fa-database text-green-600', label: 'Gestisci Database' },
    { icon: 'fas fa-user-plus text-purple-600', label: 'Nuovo Referente' },
    { icon: 'fas fa-chart-line text-orange-600', label: 'Visualizza Report' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <i className="fas fa-bolt text-yellow-600 mr-2"></i>
        Azioni Rapide
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <i className={`${action.icon} mr-3`}></i>
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
