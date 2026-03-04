import React, { useState } from 'react';
import { Camera, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockOcrScan } from '@/store/mockOcr';
import { useReconciliationStore } from '@/store/useReconciliationStore';

export const ScanCard: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const { setOcrResult, step } = useReconciliationStore();

  const handleScan = async () => {
    setScanning(true);
    try {
      const result = await mockOcrScan();
      setOcrResult(result);
    } finally {
      setScanning(false);
    }
  };

  if (step !== 'idle') return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 animate-fade-in">
      {/* Card Preview Area */}
      <div className="relative w-full max-w-sm">
        <div className="aspect-[1.75/1] w-full overflow-hidden rounded-2xl border-2 border-dashed border-primary/25 bg-accent/50">
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Camera className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Position card here
            </p>
          </div>
          {scanning && (
            <div className="absolute inset-0 rounded-2xl bg-primary/5">
              <div className="absolute left-4 right-4 h-0.5 bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.4)] animate-scan-line rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2 max-w-xs">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Scan Business Card</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Extract contact details instantly using AI-powered OCR and sync with your ERP
        </p>
      </div>

      {/* Action */}
      <Button
        onClick={handleScan}
        disabled={scanning}
        size="lg"
        className="w-full max-w-sm h-12 text-sm font-semibold rounded-xl shadow-md shadow-primary/20"
      >
        {scanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Start Scan
          </>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground">
        Powered by Gemini Vision AI
      </p>
    </div>
  );
};
