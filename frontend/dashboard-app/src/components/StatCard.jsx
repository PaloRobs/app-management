const StatCard = ({ title, value, change, changeLabel, icon, iconBg, iconColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBg}`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-green-600 text-sm font-medium">{change}</span>
        <span className="text-gray-500 text-sm ml-1">{changeLabel}</span>
      </div>
    </div>
  );
};

export default StatCard;
