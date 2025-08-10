import { useRef, useEffect } from 'react';

const ChartCard = ({ title, icon, chartId, chartType }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Per ora solo placeholder - qui integrerai Chart.js o un'altra libreria
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#6B7280';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${chartType.toUpperCase()} CHART`, canvas.width/2, canvas.height/2);
    }
  }, [chartType]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <i className={`${icon} mr-2`}></i>
        {title}
      </h3>
      <canvas 
        ref={canvasRef}
        id={chartId}
        width="400" 
        height="200"
        className="w-full h-48"
      />
    </div>
  );
};

export default ChartCard;
