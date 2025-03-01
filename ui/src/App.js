import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SurveyDesigner from './components/SurveyDesigner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import PrivateRoute from './components/auth/PrivateRoute';

// Simple Dashboard component (placeholder)
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Your Surveys</h1>
    <p>You don't have any surveys yet. Create one to get started!</p>
    <Link to="/create" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Create Survey
    </Link>
  </div>
);

// Navigation Header component
const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Survey Staff
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/create" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Create Survey
                </Link>
                <button
                  onClick={signOut}
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Log Out
                </button>
                <div className="ml-3 text-sm text-gray-500">
                  {user.email}
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

function AppContent() {
  return (
    <div className="App min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<SurveyDesigner />} />
          </Route>
          
          {/* Default route */}
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
