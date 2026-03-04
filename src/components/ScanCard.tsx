import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
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
    <div className="flex flex-col items-center gap-6 px-4 py-12">
      <div className="flex h-40 w-64 items-center justify-center rounded-lg border-2 border-dashed border-primary/30 bg-muted/50">
        <Camera className="h-16 w-16 text-muted-foreground/50" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Scan Business Card</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Take a photo or upload an image to extract contact info
        </p>
      </div>
      <Button onClick={handleScan} disabled={scanning} size="lg" className="w-full max-w-xs">
        {scanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning…
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Start Scan
          </>
        )}
      </Button>
    </div>
  );
};
