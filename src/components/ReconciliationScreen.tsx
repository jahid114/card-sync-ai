import React, { useState } from 'react';
import { useReconciliationStore } from '@/store/useReconciliationStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DiffFieldRow } from '@/components/DiffFieldRow';
import { useLazySearchPartiesQuery, useGetAddressesQuery, useGetContactsQuery } from '@/store/trytonApi';
import { User, MapPin, Phone, Check, X, Plus, Loader2, Pencil, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const PARTY_FIELD_MAP: Record<string, string> = {
  'First Name': 'pfafirstname',
  'Family Name': 'pfafamilyname',
  'Company': 'pfacompany',
  'Display Name': 'name',
};

export const ReconciliationScreen: React.FC = () => {
  const store = useReconciliationStore();
  const {
    ocrResult, draftParty, draftAddresses, draftContacts,
    matchedParty, matchedAddresses, matchedContacts,
    partyDiffs, step,
    setMatchedData, clearMatchedData, computePartyDiffs,
    setReconciliationAction, setStep, updateDraftParty,
    updateDraftAddress, updateDraftContact, reset,
  } = store;

  const [searchParties, { isFetching: isSearching }] = useLazySearchPartiesQuery();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'update' | null>(null);

  const { data: existingAddresses } = useGetAddressesQuery(matchedParty?.id ?? 0, { skip: !matchedParty });
  const { data: existingContacts } = useGetContactsQuery(matchedParty?.id ?? 0, { skip: !matchedParty });

  React.useEffect(() => {
    if (step === 'matching' && draftParty) {
      const searchTerm = draftParty.pfafamilyname || draftParty.name;
      searchParties(searchTerm).then((result) => {
        if (result.data && result.data.length > 0) {
          setMatchedData(result.data[0], [], []);
        } else {
          clearMatchedData();
        }
      });
    }
  }, [step]);

  React.useEffect(() => {
    if (matchedParty && existingAddresses && existingContacts) {
      setMatchedData(matchedParty, existingAddresses, existingContacts);
      computePartyDiffs();
    }
  }, [existingAddresses, existingContacts, matchedParty]);

  if (!ocrResult || step === 'idle') return null;

  const handleAction = (action: 'create' | 'update') => {
    setPendingAction(action);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (pendingAction) {
      setReconciliationAction(pendingAction);
      setStep('done');
      toast.success(
        pendingAction === 'create' ? 'New party will be created' : 'Existing party will be updated'
      );
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setReconciliationAction('cancel');
    reset();
    toast.info('Reconciliation cancelled');
  };

  const handleDiffEdit = (field: string, value: string) => {
    const key = PARTY_FIELD_MAP[field];
    if (key) {
      updateDraftParty({ [key]: value });
      computePartyDiffs();
    }
  };

  if (step === 'matching' || isSearching) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 animate-fade-in">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Searching for existing records…</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center gap-5 py-20 animate-slide-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
          <Check className="h-8 w-8 text-success" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">All Done!</h2>
          <p className="text-sm text-muted-foreground">Record processed successfully</p>
        </div>
        <Button onClick={reset} variant="outline" className="rounded-xl mt-2">
          <ArrowRight className="mr-2 h-4 w-4" />
          Scan Another Card
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-5 animate-slide-up">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
          matchedParty
            ? 'bg-success/10 text-success'
            : 'bg-accent text-accent-foreground'
        }`}>
          <div className={`h-1.5 w-1.5 rounded-full ${matchedParty ? 'bg-success' : 'bg-muted-foreground'}`} />
          {matchedParty ? `Matched: ${matchedParty.name}` : 'No match found'}
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1 h-11">
          <TabsTrigger value="general" className="gap-1.5 text-xs rounded-lg data-[state=active]:shadow-sm">
            <User className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="address" className="gap-1.5 text-xs rounded-lg data-[state=active]:shadow-sm">
            <MapPin className="h-3.5 w-3.5" />
            Address
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5 text-xs rounded-lg data-[state=active]:shadow-sm">
            <Phone className="h-3.5 w-3.5" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-3">
          {matchedParty && partyDiffs.length > 0 ? (
            partyDiffs.map((diff) => (
              <DiffFieldRow key={diff.field} diff={diff} onEditScanned={(val) => handleDiffEdit(diff.field, val)} />
            ))
          ) : (
            <div className="space-y-3">
              <EditableField label="First Name" value={draftParty?.pfafirstname} onChange={(v) => updateDraftParty({ pfafirstname: v })} />
              <EditableField label="Family Name" value={draftParty?.pfafamilyname} onChange={(v) => updateDraftParty({ pfafamilyname: v })} />
              <EditableField label="Company" value={draftParty?.pfacompany} onChange={(v) => updateDraftParty({ pfacompany: v })} />
              <EditableField label="Display Name" value={draftParty?.name} onChange={(v) => updateDraftParty({ name: v })} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="address" className="mt-4">
          <Accordion type="multiple" defaultValue={['addr-0']} className="space-y-3">
            {draftAddresses.map((addr, i) => (
              <AccordionItem key={i} value={`addr-${i}`} className="rounded-xl border bg-card overflow-hidden">
                <AccordionTrigger className="px-4 py-3.5 text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                      <MapPin className="h-3.5 w-3.5 text-accent-foreground" />
                    </div>
                    <span className="text-left">
                      {addr.name || addr.street || `Address ${i + 1}`}
                    </span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {addr.vcard_type}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2.5 px-4 pb-4">
                  <EditableField label="Building" value={addr.name} onChange={(v) => updateDraftAddress(i, { name: v })} />
                  <EditableField label="Street" value={addr.street} onChange={(v) => updateDraftAddress(i, { street: v })} />
                  <EditableField label="City" value={addr.city} onChange={(v) => updateDraftAddress(i, { city: v })} />
                  <EditableField label="Postal Code" value={addr.postal_code} onChange={(v) => updateDraftAddress(i, { postal_code: v })} />
                  <EditableField label="Country" value={addr.country_name} onChange={(v) => updateDraftAddress(i, { country_name: v })} />
                  <EditableField label="Subdivision" value={addr.subdivision_name} onChange={(v) => updateDraftAddress(i, { subdivision_name: v })} />

                  {matchedAddresses.length > 0 && (
                    <div className="mt-3 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/50 p-3.5">
                      <p className="erp-field-label mb-1.5">Existing Address</p>
                      <p className="text-sm text-muted-foreground">
                        {matchedAddresses[0]?.street}, {matchedAddresses[0]?.postal_code} {matchedAddresses[0]?.city}
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="contact" className="mt-4 space-y-3">
          {draftContacts.map((contact, i) => (
            <EditableContactRow
              key={i}
              type={contact.type}
              value={contact.value}
              vcardType={contact.vcard_type}
              onChange={(v) => updateDraftContact(i, { value: v })}
            />
          ))}

          {matchedContacts.length > 0 && (
            <div className="mt-4">
              <p className="erp-field-label mb-2.5 px-1">Existing Contacts</p>
              <div className="space-y-2">
                {matchedContacts.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/50 px-4 py-3">
                    <ContactIcon type={c.type} />
                    <div className="flex-1 min-w-0">
                      <p className="erp-field-label">{c.type}</p>
                      <p className="text-sm text-foreground truncate">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/90 px-5 py-4 backdrop-blur-xl">
        <div className="flex gap-2.5">
          {matchedParty ? (
            <>
              <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={handleCancel}>
                <X className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
              <Button className="flex-1 h-11 rounded-xl shadow-md shadow-primary/20" onClick={() => handleAction('update')}>
                <Check className="mr-1.5 h-4 w-4" />
                Update
              </Button>
              <Button variant="secondary" className="flex-1 h-11 rounded-xl" onClick={() => handleAction('create')}>
                <Plus className="mr-1.5 h-4 w-4" />
                New
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={handleCancel}>
                <X className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
              <Button className="flex-1 h-11 rounded-xl shadow-md shadow-primary/20" onClick={() => handleAction('create')}>
                <Plus className="mr-1.5 h-4 w-4" />
                Create New
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'create' ? 'Create New Party?' : 'Update Existing Party?'}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'create'
                ? `A new party record will be created for "${draftParty?.name}".`
                : `The existing record for "${matchedParty?.name}" will be updated with the scanned data.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-xl">
              Go Back
            </Button>
            <Button onClick={confirmAction} className="rounded-xl">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const EditableField: React.FC<{ label: string; value?: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  const handleSave = () => {
    setEditing(false);
    onChange(localValue);
  };

  return (
    <div className="rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/20">
      <p className="erp-field-label mb-1">{label}</p>
      {editing ? (
        <Input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="h-8 text-sm rounded-lg border-primary/30 bg-accent/50"
        />
      ) : (
        <div className="flex items-center gap-2 group">
          <p className="erp-field-value flex-1">{value || '—'}</p>
          <button
            onClick={() => { setLocalValue(value || ''); setEditing(true); }}
            className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

const EditableContactRow: React.FC<{ type: string; value: string; vcardType: string; onChange: (value: string) => void }> = ({ type, value, vcardType, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleSave = () => {
    setEditing(false);
    onChange(localValue);
  };

  return (
    <div className="rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/20">
      <div className="flex items-center justify-between mb-1">
        <p className="erp-field-label">{type}</p>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
          {vcardType}
        </span>
      </div>
      {editing ? (
        <Input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="h-8 text-sm rounded-lg border-primary/30 bg-accent/50"
        />
      ) : (
        <div className="flex items-center gap-2 group">
          <p className="erp-field-value flex-1">{value || '—'}</p>
          <button
            onClick={() => { setLocalValue(value); setEditing(true); }}
            className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

const ContactIcon: React.FC<{ type: string }> = ({ type }) => {
  const cls = 'h-4 w-4 text-accent-foreground';
  switch (type) {
    case 'email':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
    case 'phone':
    case 'fax':
      return <Phone className={cls} />;
    case 'mobile':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>;
    default:
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
  }
};
