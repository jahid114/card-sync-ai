import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { BottomNav } from '@/components/BottomNav';
import { ScanCard } from '@/components/ScanCard';
import { ReconciliationScreen } from '@/components/ReconciliationScreen';
import { useReconciliationStore } from '@/store/useReconciliationStore';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const { step } = useReconciliationStore();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-14">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">CardSync</h1>
            <p className="text-[10px] text-muted-foreground">Tryton ERP Integration</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'scan' && (
          <>
            {step === 'idle' && <ScanCard />}
            {step !== 'idle' && <ReconciliationScreen />}
          </>
        )}
        {activeTab === 'parties' && (
          <div className="flex flex-col items-center gap-4 px-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Party list coming soon</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="flex flex-col items-center gap-4 px-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <circle cx="12" cy="12" r="3" />
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Settings coming soon</p>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default Index;
