import React from 'react';

const FooterAd: React.FC = () => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-20 bg-slate-200 border-t border-slate-300 flex items-center justify-center z-20"
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="text-center">
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Advertisement</p>
        <p className="text-slate-700 font-medium">Responsive Banner Ad Placeholder (728x90)</p>
      </div>
    </div>
  );
};

export default FooterAd;
