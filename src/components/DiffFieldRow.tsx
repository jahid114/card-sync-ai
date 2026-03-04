import React from 'react';
import { cn } from '@/lib/utils';
import type { FieldDiff } from '@/types/trytonSchema';

interface DiffFieldRowProps {
  diff: FieldDiff;
  onUseScanned?: () => void;
  onUseExisting?: () => void;
}

export const DiffFieldRow: React.FC<DiffFieldRowProps> = ({ diff, onUseScanned, onUseExisting }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_1fr] gap-2 rounded-md border p-3 text-sm transition-colors',
        diff.isDifferent ? 'border-warning/50 bg-diff-changed' : 'border-border bg-card'
      )}
    >
      <div className="space-y-1">
        <span className="erp-field-label">{diff.field} (Scanned)</span>
        <div
          className={cn(
            'erp-field-value cursor-pointer rounded px-2 py-1 transition-colors hover:bg-primary/10',
            diff.isDifferent && 'font-semibold'
          )}
          onClick={onUseScanned}
          title="Use scanned value"
        >
          {diff.scanned || '—'}
        </div>
      </div>
      <div className="space-y-1">
        <span className="erp-field-label">{diff.field} (Database)</span>
        <div
          className={cn(
            'erp-field-value cursor-pointer rounded px-2 py-1 transition-colors hover:bg-primary/10'
          )}
          onClick={onUseExisting}
          title="Use existing value"
        >
          {diff.existing || '—'}
        </div>
      </div>
      {diff.isDifferent && (
        <div className="col-span-2 flex items-center gap-1 text-xs text-warning">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0L12 11H0L6 0ZM6 4L4.5 9H7.5L6 4Z" />
          </svg>
          Values differ
        </div>
      )}
    </div>
  );
};
