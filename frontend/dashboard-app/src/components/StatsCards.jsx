import StatCard from './StatCard';

const StatsCards = () => {
  const statsData = [
    {
      title: 'Totale Applicazioni',
      value: '47',
      change: '+12%',
      changeLabel: 'vs mese scorso',
      icon: 'fas fa-laptop-code',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Database Attivi',
      value: '23',
      change: '+5%',
      changeLabel: 'vs mese scorso',
      icon: 'fas fa-database',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Servizi API',
      value: '156',
      change: '+8%',
      changeLabel: 'vs mese scorso',
      icon: 'fas fa-cogs',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Referenti',
      value: '18',
      change: '+2',
      changeLabel: 'questo mese',
      icon: 'fas fa-users',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
