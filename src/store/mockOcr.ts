import type { OcrResult } from '@/types/trytonSchema';

// Simulates a Gemini Vision call returning structured business card data
export async function mockOcrScan(_imageData?: string): Promise<OcrResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500));

  return {
    party: {
      name: 'Max Mustermann',
      pfafirstname: 'Max',
      pfafamilyname: 'Mustermann',
      pfacompany: 'Muster GmbH',
    },
    addresses: [
      {
        name: 'Headquarters',
        street: 'Musterstraße 1a',
        city: 'München',
        postal_code: '80331',
        country_name: 'Germany',
        subdivision_name: 'Bavaria',
        vcard_type: 'WORK',
      },
    ],
    contacts: [
      { type: 'email', value: 'max.mustermann@muster.de', vcard_type: 'WORK' },
      { type: 'phone', value: '+49 89 12345678', vcard_type: 'WORK' },
      { type: 'mobile', value: '+49 170 9876543', vcard_type: 'WORK' },
      { type: 'website', value: 'www.muster-gmbh.de', vcard_type: 'WORK' },
    ],
    raw_text:
      'Max Mustermann\nMuster GmbH\nMusterstraße 1a\n80331 München\nmax.mustermann@muster.de\n+49 89 12345678\n+49 170 9876543\nwww.muster-gmbh.de',
  };
}
