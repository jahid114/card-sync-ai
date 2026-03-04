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
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">{diff.field}</p>
        {diff.isDifferent && (
          <div className="flex items-center gap-1.5 text-warning">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-[11px] font-medium">Differs</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70">Scanned</span>
          {editing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
              className="h-8 text-sm rounded-lg border-primary/30"
            />
          ) : (
            <div
              className={cn(
                'group flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm transition-colors cursor-pointer',
                'hover:bg-accent border border-transparent hover:border-border',
                diff.isDifferent && 'font-semibold'
              )}
              onClick={() => { setEditValue(diff.scanned); setEditing(true); }}
            >
              <span className="flex-1 truncate">{diff.scanned || '—'}</span>
              <Pencil className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 text-muted-foreground transition-opacity" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Existing</span>
          <div
            className="flex items-center rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground"
          >
            <span className="truncate">{diff.existing || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
