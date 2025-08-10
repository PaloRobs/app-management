const ApplicationRow = ({ name, tech, icon, iconBg, status, statusStyle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-white`}></i>
        </div>
        <div className="ml-4">
          <h4 className="text-sm font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{tech}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle}`}>
          {status}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>
    </div>
  );
};

export default ApplicationRow;
