import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Party, Address, ContactMechanism } from '@/types/trytonSchema';

// Mock base URL — replace with real Tryton JSON-RPC endpoint
const TRYTON_BASE = '/api/tryton';

// Mock data for development
const mockParties: Party[] = [
  {
    id: 1,
    name: 'Max Mustermann',
    code: 'P-001',
    pfafirstname: 'Max',
    pfafamilyname: 'Mustermann',
    pfacompany: 'Muster GmbH',
  },
  {
    id: 2,
    name: 'Erika Musterfrau',
    code: 'P-002',
    pfafirstname: 'Erika',
    pfafamilyname: 'Musterfrau',
    pfacompany: 'Beispiel AG',
  },
];

const mockAddresses: Address[] = [
  {
    id: 1,
    party: 1,
    name: 'Hauptgebäude',
    street: 'Musterstraße 1',
    city: 'München',
    postal_code: '80331',
    country: 1,
    country_name: 'Germany',
    subdivision: 1,
    subdivision_name: 'Bayern',
    vcard_type: 'WORK',
  },
];

const mockContacts: ContactMechanism[] = [
  { id: 1, party: 1, type: 'email', value: 'max@muster.de', vcard_type: 'WORK' },
  { id: 2, party: 1, type: 'phone', value: '+49 89 12345678', vcard_type: 'WORK' },
  { id: 3, party: 1, type: 'mobile', value: '+49 170 1234567', vcard_type: 'WORK' },
];

export const trytonApi = createApi({
  reducerPath: 'trytonApi',
  baseQuery: fetchBaseQuery({ baseUrl: TRYTON_BASE }),
  tagTypes: ['Party', 'Address', 'Contact'],
  endpoints: (builder) => ({
    // Parties
    searchParties: builder.query<Party[], string>({
      queryFn: async (searchTerm) => {
        // Mock: filter parties by name
        const term = searchTerm.toLowerCase();
        const results = mockParties.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.pfacompany.toLowerCase().includes(term) ||
            p.pfafamilyname.toLowerCase().includes(term)
        );
        return { data: results };
      },
      providesTags: ['Party'],
    }),

    getParty: builder.query<Party, number>({
      queryFn: async (id) => {
        const party = mockParties.find((p) => p.id === id);
        if (!party) return { error: { status: 404, data: 'Party not found' } };
        return { data: party };
      },
      providesTags: (_r, _e, id) => [{ type: 'Party', id }],
    }),

    createParty: builder.mutation<Party, Partial<Party>>({
      queryFn: async (body) => {
        const newParty: Party = {
          id: Date.now(),
          name: body.name || '',
          code: `P-${Date.now()}`,
          pfafirstname: body.pfafirstname || '',
          pfafamilyname: body.pfafamilyname || '',
          pfacompany: body.pfacompany || '',
        };
        mockParties.push(newParty);
        return { data: newParty };
      },
      invalidatesTags: ['Party'],
    }),

    updateParty: builder.mutation<Party, Partial<Party> & { id: number }>({
      queryFn: async (body) => {
        const idx = mockParties.findIndex((p) => p.id === body.id);
        if (idx === -1) return { error: { status: 404, data: 'Not found' } };
        mockParties[idx] = { ...mockParties[idx], ...body };
        return { data: mockParties[idx] };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Party', id }],
    }),

    // Addresses
    getAddresses: builder.query<Address[], number>({
      queryFn: async (partyId) => {
        return { data: mockAddresses.filter((a) => a.party === partyId) };
      },
      providesTags: ['Address'],
    }),

    createAddress: builder.mutation<Address, Partial<Address>>({
      queryFn: async (body) => {
        const addr: Address = {
          id: Date.now(),
          party: body.party || 0,
          name: body.name || '',
          street: body.street || '',
          city: body.city || '',
          postal_code: body.postal_code || '',
          country: body.country || null,
          country_name: body.country_name || '',
          subdivision: body.subdivision || null,
          subdivision_name: body.subdivision_name || '',
          vcard_type: body.vcard_type || 'WORK',
        };
        mockAddresses.push(addr);
        return { data: addr };
      },
      invalidatesTags: ['Address'],
    }),

    // Contact Mechanisms
    getContacts: builder.query<ContactMechanism[], number>({
      queryFn: async (partyId) => {
        return { data: mockContacts.filter((c) => c.party === partyId) };
      },
      providesTags: ['Contact'],
    }),

    createContact: builder.mutation<ContactMechanism, Partial<ContactMechanism>>({
      queryFn: async (body) => {
        const contact: ContactMechanism = {
          id: Date.now(),
          party: body.party || 0,
          type: body.type || 'other',
          value: body.value || '',
          vcard_type: body.vcard_type || 'WORK',
        };
        mockContacts.push(contact);
        return { data: contact };
      },
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useSearchPartiesQuery,
  useLazySearchPartiesQuery,
  useGetPartyQuery,
  useCreatePartyMutation,
  useUpdatePartyMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useGetContactsQuery,
  useCreateContactMutation,
} = trytonApi;
