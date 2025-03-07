import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SurveyDesigner from './components/SurveyDesigner';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks';
import AuthPage from './components/auth/AuthPage';
import PrivateRoute from './components/auth/PrivateRoute';
import DataExample from './components/examples/DataExample';
import StorageExample from './components/examples/StorageExample';

// Simple Dashboard component (placeholder)
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Your Surveys</h1>
    <p>You don't have any surveys yet. Create one to get started!</p>
    <Link to="/create" className="mt-4 inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
      Create Survey
    </Link>
    
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Data Operations</h2>
        <p className="text-gray-600 mb-4">Example of CRUD operations using our data service</p>
        <Link to="/examples/data" className="text-blue-600 hover:text-blue-800">
          View Example →
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Storage Operations</h2>
        <p className="text-gray-600 mb-4">Example of file operations using our storage service</p>
        <Link to="/examples/storage" className="text-blue-600 hover:text-blue-800">
          View Example →
        </Link>
      </div>
    </div>
  </div>
);

// Navigation Header component
const Header = () => {
  const { user, signOut, loading } = useAuth();

  // Don't render anything while checking authentication
  if (loading) return null;

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
                  Sign Out
                </button>
                <div className="ml-3 text-sm text-gray-600">
                  {user.email}
                </div>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Add this debug component
function AuthDebugger() {
  const { user, loading, error, debugInfo } = useAuth();
  
  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 m-4 rounded shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <pre className="overflow-auto max-h-40">
        {JSON.stringify({
          user: user ? { 
            id: user.id,
            email: user.email,
            role: user.role,
            lastSignIn: user.last_sign_in_at
          } : null,
          loading,
          error,
          ...debugInfo
        }, null, 2)}
      </pre>
    </div>
  );
}

function AppContent() {
  const { loading } = useAuth();

  // Show a simple loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            <Route path="/examples/data" element={<DataExample />} />
            <Route path="/examples/storage" element={<StorageExample />} />
          </Route>
          
          {/* Default route */}
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </div>
      {/* Add the debugger */}
      <AuthDebugger />
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
