import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TOOLS } from './constants/tools';
import ScrollToTop from './components/ScrollToTop';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [isLaunching, setIsLaunching] = useState(() => {
    // Check if running in standalone mode (PWA)
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      return isStandalone;
    }
    return false;
  });
  const location = useLocation();
  const activeTool = TOOLS.find(t => t.href === location.pathname);

  // No global beforeunload here, handled per tool

  return (
    <>
      <AnimatePresence mode="wait">
        {isLaunching && (
          <SplashScreen key="splash" onComplete={() => setIsLaunching(false)} />
        )}
      </AnimatePresence>

      {!isLaunching && (
        <Layout activeToolName={activeTool?.name}>
          <ScrollToTop />
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-neutral-500 animate-pulse">Initializing engine...</p>
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </Layout>
      )}
    </>
  );
}

