import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

interface UseFileExitConfirmProps {
  isDirty: boolean;
}

export function useFileExitConfirm({ isDirty }: UseFileExitConfirmProps) {
  // 1. Handle browser close / refresh
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 2. Handle internal router navigation
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  return blocker;
}
