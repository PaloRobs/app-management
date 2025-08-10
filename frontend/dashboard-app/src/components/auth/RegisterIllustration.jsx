import React from 'react';

const RegisterIllustration = () => {
  return (
    <div className="w-80 h-80 relative">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        
        {/* Central Form */}
        <g transform="translate(150, 150)">
          <rect x="0" y="0" width="100" height="120" rx="8" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          {/* Header */}
          <rect x="8" y="8" width="84" height="16" rx="2" fill="#8B5CF6" />
          
          {/* Form Fields */}
          <rect x="12" y="32" width="76" height="8" rx="2" fill="#E5E7EB" />
          <rect x="12" y="44" width="60" height="8" rx="2" fill="#E5E7EB" />
          <rect x="12" y="56" width="80" height="8" rx="2" fill="#E5E7EB" />
          <rect x="12" y="68" width="55" height="8" rx="2" fill="#E5E7EB" />
          
          {/* Submit Button */}
          <rect x="12" y="85" width="76" height="12" rx="4" fill="#8B5CF6" />
          <text x="50" y="93" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial">REGISTRATI</text>
          
          {/* Progress Indicator */}
          <circle cx="20" cy="105" r="3" fill="#10B981" />
          <circle cx="30" cy="105" r="3" fill="#8B5CF6" />
          <circle cx="40" cy="105" r="3" fill="#E5E7EB" />
        </g>

        {/* Team Members */}
        <g transform="translate(80, 80)">
          <circle cx="15" cy="15" r="12" fill="rgba(255,255,255,0.9)" />
          <circle cx="15" cy="12" r="4" fill="#8B5CF6" />
          <path d="M7 20 C7 17, 11 15, 15 15 C19 15, 23 17, 23 20 L23 22 L7 22 Z" fill="#8B5CF6" />
          {/* Badge */}
          <circle cx="22" cy="8" r="4" fill="#10B981" />
          <text x="22" y="10" textAnchor="middle" fill="white" fontSize="4">✓</text>
        </g>
        
        <g transform="translate(290, 100)">
          <circle cx="15" cy="15" r="12" fill="rgba(255,255,255,0.9)" />
          <circle cx="15" cy="12" r="4" fill="#3B82F6" />
          <path d="M7 20 C7 17, 11 15, 15 15 C19 15, 23 17, 23 20 L23 22 L7 22 Z" fill="#3B82F6" />
          {/* Badge */}
          <circle cx="22" cy="8" r="4" fill="#F59E0B" />
          <text x="22" y="10" textAnchor="middle" fill="white" fontSize="4">!</text>
        </g>

        <g transform="translate(120, 300)">
          <circle cx="15" cy="15" r="12" fill="rgba(255,255,255,0.9)" />
          <circle cx="15" cy="12" r="4" fill="#EF4444" />
          <path d="M7 20 C7 17, 11 15, 15 15 C19 15, 23 17, 23 20 L23 22 L7 22 Z" fill="#EF4444" />
          {/* Badge */}
          <circle cx="22" cy="8" r="4" fill="#10B981" />
          <text x="22" y="10" textAnchor="middle" fill="white" fontSize="4">+</text>
        </g>

        {/* Welcome Message */}
        <g transform="translate(280, 280)">
          <rect x="0" y="0" width="60" height="30" rx="4" fill="rgba(255,255,255,0.9)" />
          <text x="30" y="12" textAnchor="middle" fill="#8B5CF6" fontSize="8" fontFamily="Arial">Welcome!</text>
          <text x="30" y="22" textAnchor="middle" fill="#6B7280" fontSize="6" fontFamily="Arial">New User</text>
        </g>

        {/* Connection Lines */}
        <line x1="95" y1="95" x2="150" y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="305" y1="115" x2="250" y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="135" y1="315" x2="150" y2="270" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="280" y1="295" x2="250" y2="270" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />

        {/* Security Shield */}
        <g transform="translate(320, 180)">
          <path d="M15 5 L5 10 L5 20 C5 25, 10 30, 15 30 C20 30, 25 25, 25 20 L25 10 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <path d="M12 16 L14 18 L18 14" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Floating Elements */}
        <circle cx="60" cy="200" r="3" fill="rgba(255,255,255,0.6)">
          <animate attributeName="cy" values="200;190;200" dur="3s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="340" cy="160" r="2" fill="rgba(255,255,255,0.4)">
          <animate attributeName="cy" values="160;150;160" dur="4s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="350" cy="300" r="4" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="300;290;300" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default RegisterIllustration;
