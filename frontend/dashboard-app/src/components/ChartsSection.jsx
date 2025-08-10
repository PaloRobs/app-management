import ChartCard from './ChartCard';

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard
        title="Distribuzione Framework"
        icon="fas fa-chart-pie text-blue-600"
        chartId="frameworkChart"
        chartType="doughnut"
      />
      <ChartCard
        title="Tipologie Database"
        icon="fas fa-chart-bar text-green-600"
        chartId="databaseChart"
        chartType="bar"
      />
    </div>
  );
};

export default ChartsSection;
