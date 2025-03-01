import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useAuth();

  // If user is already logged in, redirect to the dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Survey Staff
        </h1>
        
        <div className="bg-white shadow rounded-lg">
          <div className="flex border-b">
            <button
              className={`w-1/2 py-4 px-6 text-center ${
                activeTab === 'login'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Log In
            </button>
            <button
              className={`w-1/2 py-4 px-6 text-center ${
                activeTab === 'signup'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'login' ? <LoginForm /> : <SignUpForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage; 