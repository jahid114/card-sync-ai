import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ScanCard } from '@/components/ScanCard';
import { ReconciliationScreen } from '@/components/ReconciliationScreen';
import { useReconciliationStore } from '@/store/useReconciliationStore';

const AppContent: React.FC = () => {
  const { step } = useReconciliationStore();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">CardSync</h1>
            <p className="text-[11px] text-muted-foreground">Tryton ERP Integration</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {step === 'idle' ? <ScanCard /> : <ReconciliationScreen />}
      </main>
    </div>
  );
};

const Index: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default Index;
