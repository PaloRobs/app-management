// src/components/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Chiama il tuo backend
      await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      setSuccess(true);
    } catch (error) {
      // Gestisci errore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center">
      {/* La TUA interfaccia personalizzata con i tuoi colori */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {success ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Inviata!</h2>
            <p className="text-gray-600">Controlla la tua casella email per il link di reset.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Inserisci la tua email"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-medium"
            >
              {loading ? 'Invio...' : 'Invia Link Reset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
