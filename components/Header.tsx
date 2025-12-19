import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PaperAirplaneIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from './icons';

interface HeaderProps {
  onNavigateHome?: () => void;
  isHome?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, isHome }) => {
  const { currentUser, logout } = useAuth();
  
  const logoClasses = currentUser && !isHome 
    ? "flex items-center cursor-pointer transition-opacity hover:opacity-80" 
    : "flex items-center";
  
  const handleLogoClick = () => {
    if (currentUser && !isHome && onNavigateHome) {
      onNavigateHome();
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className={logoClasses} 
            onClick={handleLogoClick} 
            role={currentUser && !isHome ? "button" : undefined} 
            tabIndex={currentUser && !isHome ? 0 : -1} 
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleLogoClick()}
            aria-label={currentUser && !isHome ? "Go to dashboard" : undefined}
          >
            <PaperAirplaneIcon className="h-8 w-8 text-teal-600 transform -rotate-45" />
            <h1 className="ml-3 text-2xl font-bold text-slate-900 tracking-tight">
              SkyLog
            </h1>
          </div>
          {currentUser && (
            <div className="flex items-center">
              <UserCircleIcon className="h-6 w-6 text-slate-500" />
              <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block" aria-label="Current user">{currentUser}</span>
              <button 
                onClick={logout} 
                className="ml-4 flex items-center text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
                aria-label="Log out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 md:mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;