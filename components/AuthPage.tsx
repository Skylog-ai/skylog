import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaperAirplaneIcon } from './icons';

declare global {
    interface Window {
        google: any;
    }
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = (response: any) => {
    setIsLoading(true);
    try {
        loginWithGoogle(response.credential);
    } catch (err: any) {
        setError(err.message || "Could not sign in with Google.");
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.google) {
        window.google.accounts.id.initialize({
            // IMPORTANT: Replace this with your own Google Client ID
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.google.com',
            callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'rectangular', width: '300' }
        );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6">
          <PaperAirplaneIcon className="h-10 w-10 text-teal-600 transform -rotate-45" />
          <h1 className="ml-3 text-3xl font-bold text-slate-900 tracking-tight">
            SkyLog
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-center text-slate-500 mb-6">
            {isLogin ? 'Log in to view your flight history.' : 'Track your flights and unlock achievements.'}
          </p>
          
          <div id="googleSignInButton" className="flex justify-center mb-6"></div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-medium text-sm text-teal-600 hover:text-teal-500"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
            Note: This is a demo application. User data is stored in your browser's local storage and is not transmitted to a server.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;