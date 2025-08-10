import React, { useEffect, useState } from 'react';

const LoginIllustration = () => {
  const [counters, setCounters] = useState({ apps: 0, db: 0, team: 0 });

  useEffect(() => {
    const targetValues = { apps: 47, db: 23, team: 18 };
    const duration = 2000; // 2 secondi
    const intervals = 50; // aggiornamenti ogni 50ms
    const steps = duration / intervals;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      if (progress >= 1) {
        setCounters(targetValues);
        clearInterval(timer);
      } else {
        setCounters({
          apps: Math.floor(targetValues.apps * progress),
          db: Math.floor(targetValues.db * progress),
          team: Math.floor(targetValues.team * progress)
        });
      }
    }, intervals);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: '360px', height: '360px' }}>
      <svg
        viewBox="0 0 480 480"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="240"
          cy="240"
          r="200"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        
        {/* Server/Database Icons - ingranditi */}
        <g transform="translate(132, 96)">
          <rect x="0" y="0" width="72" height="48" rx="7" fill="rgba(255,255,255,0.95)" />
          <rect x="7" y="7" width="58" height="7" rx="2" fill="#0D9488" />
          <rect x="7" y="19" width="42" height="5" rx="2" fill="#E5E7EB" />
          <rect x="7" y="29" width="48" height="5" rx="2" fill="#E5E7EB" />
          <rect x="7" y="38" width="30" height="5" rx="2" fill="#E5E7EB" />
        </g>
        
        <g transform="translate(276, 108)">
          <rect x="0" y="0" width="72" height="48" rx="7" fill="rgba(255,255,255,0.95)" />
          <rect x="7" y="7" width="58" height="7" rx="2" fill="#0891B2" />
          <rect x="7" y="19" width="36" height="5" rx="2" fill="#E5E7EB" />
          <rect x="7" y="29" width="48" height="5" rx="2" fill="#E5E7EB" />
          <rect x="7" y="38" width="42" height="5" rx="2" fill="#E5E7EB" />
        </g>

        {/* Central Dashboard - più grande */}
        <g transform="translate(180, 204)">
          <rect x="0" y="0" width="120" height="96" rx="10" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          {/* Header */}
          <rect x="10" y="10" width="100" height="14" rx="3" fill="#0D9488" />
          {/* Content bars */}
          <rect x="10" y="32" width="78" height="7" rx="2" fill="#E5E7EB" />
          <rect x="10" y="42" width="60" height="7" rx="2" fill="#E5E7EB" />
          <rect x="10" y="52" width="90" height="7" rx="2" fill="#E5E7EB" />
          {/* Chart simulation */}
          <g transform="translate(10, 62)">
            <rect x="0" y="10" width="10" height="10" fill="#0D9488" rx="1" />
            <rect x="15" y="6" width="10" height="14" fill="#0891B2" rx="1" />
            <rect x="30" y="8" width="10" height="12" fill="#06B6D4" rx="1" />
            <rect x="45" y="3" width="10" height="17" fill="#22D3EE" rx="1" />
            <rect x="60" y="5" width="10" height="15" fill="#67E8F9" rx="1" />
          </g>
        </g>

        {/* Rimosso le icone utente dietro i numeri per migliorare la visibilità */}

        {/* Connection Lines - più visibili */}
        <line x1="168" y1="144" x2="180" y2="204" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="6,6" />
        <line x1="312" y1="156" x2="280" y2="204" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="6,6" />
        <line x1="114" y1="366" x2="180" y2="300" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="6,6" />
        <line x1="366" y1="384" x2="300" y2="300" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="6,6" />

        {/* Floating Elements con animazioni migliorate */}
        <circle cx="384" cy="180" r="4" fill="rgba(255,255,255,0.6)">
          <animate attributeName="cy" values="180;165;180" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="84" cy="216" r="3" fill="rgba(255,255,255,0.4)">
          <animate attributeName="cy" values="216;196;216" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="408" cy="300" r="5" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="300;280;300" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Decorative elements - più grandi */}
        <g transform="translate(384, 216)">
          <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.3)" />
          <circle cx="12" cy="12" r="6" fill="#22D3EE">
            <animate attributeName="r" values="6;9;6" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
        
        <g transform="translate(60, 144)">
          <circle cx="12" cy="12" r="8" fill="rgba(255,255,255,0.3)" />
          <circle cx="12" cy="12" r="5" fill="#67E8F9">
            <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Network/Connection Animation */}
        <g transform="translate(240, 420)">
          <circle cx="0" cy="0" r="3" fill="#22D3EE">
            <animate attributeName="r" values="3;12;3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* Statistiche animate in basso - font più grandi */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl font-bold">{counters.apps}</span>
          </div>
          <span className="text-lg font-semibold text-teal-100">Apps</span>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl font-bold">{counters.db}</span>
          </div>
          <span className="text-lg font-semibold text-teal-100">DB</span>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl font-bold">{counters.team}</span>
          </div>
          <span className="text-lg font-semibold text-teal-100">Team</span>
        </div>
      </div>
    </div>
  );
};

export default LoginIllustration;
