import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Pencil, AlertTriangle } from 'lucide-react';
import type { FieldDiff } from '@/types/trytonSchema';

interface DiffFieldRowProps {
  diff: FieldDiff;
  onUseScanned?: () => void;
  onUseExisting?: () => void;
  onEditScanned?: (value: string) => void;
}

export const DiffFieldRow: React.FC<DiffFieldRowProps> = ({ diff, onUseScanned, onUseExisting, onEditScanned }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(diff.scanned);

  const handleSave = () => {
    setEditing(false);
    onEditScanned?.(editValue);
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all',
        diff.isDifferent
          ? 'border-warning/40 bg-diff-changed shadow-sm'
          : 'border-border bg-card'
      )}
    >
      {diff.isDifferent && (
        <div className="flex items-center gap-1.5 mb-3 text-warning">
          <AlertTriangle className="h-3 w-3" />
          <span className="text-[11px] font-medium">Values differ</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <span className="erp-field-label">Scanned</span>
          {editing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
              className="h-8 text-sm rounded-lg"
            />
          ) : (
            <div
              className={cn(
                'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm transition-colors cursor-pointer',
                'hover:bg-accent',
                diff.isDifferent && 'font-semibold'
              )}
              onClick={onUseScanned}
            >
              <span className="flex-1 truncate">{diff.scanned || '—'}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setEditValue(diff.scanned); setEditing(true); }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <span className="erp-field-label">Database</span>
          <div
            className="flex items-center rounded-lg px-2.5 py-1.5 text-sm transition-colors cursor-pointer hover:bg-accent"
            onClick={onUseExisting}
          >
            <span className="truncate text-muted-foreground">{diff.existing || '—'}</span>
          </div>
        </div>
      </div>
      <p className="erp-field-label mt-2">{diff.field}</p>
    </div>
  );
};
