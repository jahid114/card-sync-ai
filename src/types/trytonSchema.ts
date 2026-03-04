// Tryton ERP Data Schema

export type VCardType = 'WORK' | 'HOME' | 'OTHER';

export type ContactType =
  | 'phone'
  | 'mobile'
  | 'fax'
  | 'email'
  | 'website'
  | 'skype'
  | 'sip'
  | 'irc'
  | 'jabber'
  | 'other';

export interface Party {
  id: number;
  name: string;
  code: string;
  pfafirstname: string;
  pfafamilyname: string;
  pfacompany: string;
  addresses?: Address[];
  contact_mechanisms?: ContactMechanism[];
}

export interface Address {
  id: number;
  party: number;
  name: string; // Building name
  street: string;
  city: string;
  postal_code: string;
  country: number | null; // many2one ref
  country_name?: string;
  subdivision: number | null; // many2one ref
  subdivision_name?: string;
  vcard_type: VCardType;
}

export interface ContactMechanism {
  id: number;
  party: number;
  type: ContactType;
  value: string;
  vcard_type: VCardType;
}

// Draft versions (from OCR, no IDs yet)
export interface DraftParty {
  name: string;
  pfafirstname: string;
  pfafamilyname: string;
  pfacompany: string;
}

export interface DraftAddress {
  name: string;
  street: string;
  city: string;
  postal_code: string;
  country_name: string;
  subdivision_name: string;
  vcard_type: VCardType;
}

export interface DraftContactMechanism {
  type: ContactType;
  value: string;
  vcard_type: VCardType;
}

export interface OcrResult {
  party: DraftParty;
  addresses: DraftAddress[];
  contacts: DraftContactMechanism[];
  raw_text?: string;
}

export interface FieldDiff {
  field: string;
  scanned: string;
  existing: string;
  isDifferent: boolean;
}

export type ReconciliationAction = 'create' | 'update' | 'cancel';
