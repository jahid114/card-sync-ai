import { create } from 'zustand';
import type {
  OcrResult,
  Party,
  Address,
  ContactMechanism,
  FieldDiff,
  ReconciliationAction,
  DraftParty,
  DraftAddress,
  DraftContactMechanism,
} from '@/types/trytonSchema';

interface ReconciliationState {
  // OCR scan result
  ocrResult: OcrResult | null;
  setOcrResult: (result: OcrResult) => void;

  // Matched existing party (if found)
  matchedParty: Party | null;
  matchedAddresses: Address[];
  matchedContacts: ContactMechanism[];
  setMatchedData: (party: Party, addresses: Address[], contacts: ContactMechanism[]) => void;
  clearMatchedData: () => void;

  // Draft edits (user can tweak before committing)
  draftParty: DraftParty | null;
  draftAddresses: DraftAddress[];
  draftContacts: DraftContactMechanism[];
  updateDraftParty: (updates: Partial<DraftParty>) => void;
  updateDraftAddress: (index: number, updates: Partial<DraftAddress>) => void;
  updateDraftContact: (index: number, updates: Partial<DraftContactMechanism>) => void;

  // Comparison diffs
  partyDiffs: FieldDiff[];
  computePartyDiffs: () => void;

  // Action
  reconciliationAction: ReconciliationAction | null;
  setReconciliationAction: (action: ReconciliationAction) => void;

  // Workflow
  step: 'idle' | 'scanning' | 'matching' | 'reconciling' | 'done';
  setStep: (step: ReconciliationState['step']) => void;

  // Reset
  reset: () => void;
}

function compareField(field: string, scanned: string, existing: string): FieldDiff {
  return {
    field,
    scanned: scanned || '',
    existing: existing || '',
    isDifferent: (scanned || '').trim().toLowerCase() !== (existing || '').trim().toLowerCase(),
  };
}

export const useReconciliationStore = create<ReconciliationState>((set, get) => ({
  ocrResult: null,
  setOcrResult: (result) =>
    set({
      ocrResult: result,
      draftParty: { ...result.party },
      draftAddresses: [...result.addresses],
      draftContacts: [...result.contacts],
      step: 'matching',
    }),

  matchedParty: null,
  matchedAddresses: [],
  matchedContacts: [],
  setMatchedData: (party, addresses, contacts) =>
    set({ matchedParty: party, matchedAddresses: addresses, matchedContacts: contacts, step: 'reconciling' }),
  clearMatchedData: () =>
    set({ matchedParty: null, matchedAddresses: [], matchedContacts: [], step: 'reconciling' }),

  draftParty: null,
  draftAddresses: [],
  draftContacts: [],
  updateDraftParty: (updates) =>
    set((s) => ({ draftParty: s.draftParty ? { ...s.draftParty, ...updates } : null })),
  updateDraftAddress: (index, updates) =>
    set((s) => ({
      draftAddresses: s.draftAddresses.map((a, i) => (i === index ? { ...a, ...updates } : a)),
    })),
  updateDraftContact: (index, updates) =>
    set((s) => ({
      draftContacts: s.draftContacts.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    })),

  partyDiffs: [],
  computePartyDiffs: () => {
    const { draftParty, matchedParty } = get();
    if (!draftParty || !matchedParty) {
      set({ partyDiffs: [] });
      return;
    }
    const diffs: FieldDiff[] = [
      compareField('First Name', draftParty.pfafirstname, matchedParty.pfafirstname),
      compareField('Family Name', draftParty.pfafamilyname, matchedParty.pfafamilyname),
      compareField('Company', draftParty.pfacompany, matchedParty.pfacompany),
      compareField('Display Name', draftParty.name, matchedParty.name),
    ];
    set({ partyDiffs: diffs });
  },

  reconciliationAction: null,
  setReconciliationAction: (action) => set({ reconciliationAction: action }),

  step: 'idle',
  setStep: (step) => set({ step }),

  reset: () =>
    set({
      ocrResult: null,
      matchedParty: null,
      matchedAddresses: [],
      matchedContacts: [],
      draftParty: null,
      draftAddresses: [],
      draftContacts: [],
      partyDiffs: [],
      reconciliationAction: null,
      step: 'idle',
    }),
}));
