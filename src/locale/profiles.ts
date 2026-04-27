// Country profiles drive currency, phone format, privacy law, payment methods,
// comms channels, AI prompt localization, and SEO LocalBusiness schema.

export type CountryCode =
  | 'ZA' | 'NG' | 'KE' | 'IN' | 'BR'
  | 'US' | 'GB' | 'AU' | 'CA' | 'DE'

export type PrivacyLaw = 'POPIA' | 'GDPR' | 'CCPA' | 'LGPD' | 'PIPEDA' | 'PDPA' | 'APP' | 'NDPA' | 'DPA-KE'
export type TaxLabel = 'VAT' | 'GST' | 'sales tax' | 'IVA' | 'none'
export type CommsChannel = 'whatsapp' | 'sms' | 'imessage' | 'telegram'

export interface CountryProfile {
  code: CountryCode
  name: string
  flag: string
  currencyCode: string
  currencySymbol: string
  /** When formatting prices, place symbol before or after the amount */
  symbolPosition: 'before' | 'after'
  /** Decimal separator and thousand separator for prices */
  decimal: '.' | ','
  thousand: ',' | '.' | ' '
  /** Phone country code (e.g. '27' for South Africa) */
  phoneCountryCode: string
  /** Sample phone format placeholder (used in the contact form hint) */
  phoneSample: string
  /** Strip leading 0 in national numbers? Most countries with trunk codes yes. */
  stripLeadingZero: boolean
  privacyLaw: PrivacyLaw
  taxLabel: TaxLabel
  /** Default tax rate (%) for the toggle in pricing */
  defaultTaxRate: number
  /** Primary comms channel for floating widget + first-suggestion */
  primaryComms: CommsChannel
  /** Common payment / banking methods listed in EFT section */
  paymentMethods: string[]
  /** A list of locally common business industries surfaced first in templates */
  industriesFirst: string[]
  /** A few common cities for placeholder/auto-filled location text */
  cities: string[]
  /** AI prompt instructions: names + idioms */
  promptHint: string
  /** Address format hint shown above contact address field */
  addressHint: string
  /** Postal code label */
  postalLabel: string
}

export const COUNTRIES: Record<CountryCode, CountryProfile> = {
  ZA: {
    code: 'ZA', name: 'South Africa', flag: '🇿🇦',
    currencyCode: 'ZAR', currencySymbol: 'R', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '27', phoneSample: '+27 11 000 0000', stripLeadingZero: true,
    privacyLaw: 'POPIA', taxLabel: 'VAT', defaultTaxRate: 15,
    primaryComms: 'whatsapp',
    paymentMethods: ['EFT (bank transfer)', 'Cash', 'Card', 'SnapScan / Zapper', 'PayFast'],
    industriesFirst: ['Plumbing', 'Beauty salon', 'Spaza shop', 'Attorney', 'Panel beater', 'Lodge / Guesthouse', 'Tutoring', 'Dentist'],
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
    promptHint: 'South African business. Use Anglicised + isiZulu/Xhosa names like Sarah Johnson, Sipho Dlamini, Thandi Naidoo, Andile Mokoena. Use SA terms (panel beater, petrol station, geyser, load shedding awareness). Reference SA cities. Prices in ZAR with R prefix. Mention POPIA for privacy.',
    addressHint: 'Suburb, City, Province (e.g. Sandton, Johannesburg, Gauteng)',
    postalLabel: 'Postal code',
  },
  NG: {
    code: 'NG', name: 'Nigeria', flag: '🇳🇬',
    currencyCode: 'NGN', currencySymbol: '₦', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '234', phoneSample: '+234 80 0000 0000', stripLeadingZero: true,
    privacyLaw: 'NDPA', taxLabel: 'VAT', defaultTaxRate: 7.5,
    primaryComms: 'whatsapp',
    paymentMethods: ['Bank transfer', 'POS / Card', 'USSD', 'Paystack / Flutterwave', 'Cash'],
    industriesFirst: ['Tailor', 'Restaurant', 'Logistics', 'Beauty salon', 'Tech startup', 'Real estate', 'Pharmacy', 'Mechanic'],
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'],
    promptHint: 'Nigerian business. Use Yoruba/Igbo/Hausa names like Adeola Bakare, Chinedu Okafor, Aisha Bello, Tunde Adeyemi. Reference Lagos/Abuja/Port Harcourt. Prices in NGN with ₦ prefix. Mention NDPA for privacy. Use Naira amounts that match local market reality.',
    addressHint: 'Area, City, State (e.g. Ikeja, Lagos)',
    postalLabel: 'Postal code',
  },
  KE: {
    code: 'KE', name: 'Kenya', flag: '🇰🇪',
    currencyCode: 'KES', currencySymbol: 'KSh', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '254', phoneSample: '+254 700 000 000', stripLeadingZero: true,
    privacyLaw: 'DPA-KE', taxLabel: 'VAT', defaultTaxRate: 16,
    primaryComms: 'whatsapp',
    paymentMethods: ['M-Pesa Paybill / Till', 'Bank transfer', 'Card', 'Cash'],
    industriesFirst: ['Restaurant', 'Tailor', 'Beauty salon', 'Mechanic', 'Tech startup', 'Boda boda fleet', 'Pharmacy', 'Real estate'],
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
    promptHint: 'Kenyan business. Use Swahili/local names like Wanjiru Kamau, Otieno Onyango, Aisha Hassan, Brian Mutua. Reference Nairobi/Mombasa. Prices in KES with KSh prefix. Mention M-Pesa as primary payment. Mention the Data Protection Act for privacy.',
    addressHint: 'Area, City (e.g. Westlands, Nairobi)',
    postalLabel: 'Postal code',
  },
  IN: {
    code: 'IN', name: 'India', flag: '🇮🇳',
    currencyCode: 'INR', currencySymbol: '₹', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '91', phoneSample: '+91 98765 43210', stripLeadingZero: true,
    privacyLaw: 'PDPA', taxLabel: 'GST', defaultTaxRate: 18,
    primaryComms: 'whatsapp',
    paymentMethods: ['UPI', 'Bank transfer', 'Card', 'Net banking', 'Cash'],
    industriesFirst: ['Tutoring centre', 'Restaurant', 'Tailor', 'Kirana store', 'Beauty salon', 'Mechanic', 'Pharmacy', 'Tech consultancy'],
    cities: ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'],
    promptHint: 'Indian business. Use names like Priya Sharma, Arjun Patel, Anjali Reddy, Vikram Iyer. Reference Mumbai/Bangalore/Delhi/Pune. Prices in INR with ₹ prefix. Use GST not VAT. Mention DPDP/PDPA for privacy. Use local industry terms (kirana, tuition centre).',
    addressHint: 'Area, City, State, PIN (e.g. Andheri West, Mumbai, Maharashtra 400053)',
    postalLabel: 'PIN code',
  },
  BR: {
    code: 'BR', name: 'Brazil', flag: '🇧🇷',
    currencyCode: 'BRL', currencySymbol: 'R$', symbolPosition: 'before',
    decimal: ',', thousand: '.',
    phoneCountryCode: '55', phoneSample: '+55 11 98765-4321', stripLeadingZero: true,
    privacyLaw: 'LGPD', taxLabel: 'IVA', defaultTaxRate: 17,
    primaryComms: 'whatsapp',
    paymentMethods: ['PIX', 'Boleto', 'Card', 'Bank transfer'],
    industriesFirst: ['Restaurante', 'Salão de beleza', 'Padaria', 'Mecânico', 'Imobiliária', 'Consultor', 'Loja', 'Studio'],
    cities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba'],
    promptHint: 'Brazilian business. Use Portuguese names like Carla Silva, João Santos, Ana Oliveira, Bruno Costa. Reference São Paulo/Rio. Prices in BRL with R$ prefix. Use LGPD for privacy. Mention PIX as preferred payment. Decimal comma, thousand period.',
    addressHint: 'Bairro, Cidade, Estado, CEP (ex.: Pinheiros, São Paulo, SP 05422-010)',
    postalLabel: 'CEP',
  },
  US: {
    code: 'US', name: 'United States', flag: '🇺🇸',
    currencyCode: 'USD', currencySymbol: '$', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '1', phoneSample: '+1 (555) 555-1234', stripLeadingZero: false,
    privacyLaw: 'CCPA', taxLabel: 'sales tax', defaultTaxRate: 7,
    primaryComms: 'sms',
    paymentMethods: ['Card', 'ACH transfer', 'Zelle', 'PayPal', 'Cash', 'Check'],
    industriesFirst: ['Plumber', 'Realtor', 'Auto body shop', 'Hair salon', 'Restaurant', 'Dentist', 'Attorney', 'Bodega'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Atlanta', 'Miami'],
    promptHint: 'US business. Use names like Sarah Johnson, Michael Davis, Emily Rodriguez, Brandon Kim. Reference major US cities. Prices in USD with $ prefix. Use "sales tax" not VAT. Mention CCPA for privacy. Use US English (gas station, realtor, auto body shop).',
    addressHint: 'Street, City, State ZIP (e.g. 123 Main St, Brooklyn, NY 11201)',
    postalLabel: 'ZIP code',
  },
  GB: {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧',
    currencyCode: 'GBP', currencySymbol: '£', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '44', phoneSample: '+44 20 7946 0000', stripLeadingZero: true,
    privacyLaw: 'GDPR', taxLabel: 'VAT', defaultTaxRate: 20,
    primaryComms: 'whatsapp',
    paymentMethods: ['Bank transfer (Faster Payments)', 'Card', 'Direct Debit', 'Cash'],
    industriesFirst: ['Plumber', 'Estate agent', 'Beauty salon', 'Restaurant', 'Solicitor', 'Garage', 'Café', 'Tutor'],
    cities: ['London', 'Manchester', 'Birmingham', 'Bristol', 'Leeds', 'Edinburgh'],
    promptHint: 'UK business. Use names like Sarah Thompson, James Walker, Emma Patel, Oliver Smith. Reference London/Manchester. Prices in GBP with £ prefix. Use UK English (estate agent, solicitor, petrol). Mention UK GDPR / DPA 2018 for privacy.',
    addressHint: 'Street, Town, County, Postcode (e.g. 12 King St, Manchester, M1 1AB)',
    postalLabel: 'Postcode',
  },
  AU: {
    code: 'AU', name: 'Australia', flag: '🇦🇺',
    currencyCode: 'AUD', currencySymbol: 'A$', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '61', phoneSample: '+61 2 9000 0000', stripLeadingZero: true,
    privacyLaw: 'APP', taxLabel: 'GST', defaultTaxRate: 10,
    primaryComms: 'sms',
    paymentMethods: ['PayID', 'Bank transfer', 'Card', 'BPAY', 'Cash'],
    industriesFirst: ['Tradie / Plumber', 'Café', 'Beauty salon', 'Mechanic', 'Real estate agent', 'Solicitor', 'Tutor', 'Pharmacy'],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    promptHint: 'Australian business. Use names like Sarah Wilson, Liam Murphy, Chloe Nguyen, Jack Thompson. Reference Sydney/Melbourne. Prices in AUD with A$ prefix. Use Australian English (tradie, ute). Mention Australian Privacy Principles (APP) for privacy. GST inclusive pricing standard.',
    addressHint: 'Street, Suburb State Postcode (e.g. 12 Pitt St, Sydney NSW 2000)',
    postalLabel: 'Postcode',
  },
  CA: {
    code: 'CA', name: 'Canada', flag: '🇨🇦',
    currencyCode: 'CAD', currencySymbol: 'C$', symbolPosition: 'before',
    decimal: '.', thousand: ',',
    phoneCountryCode: '1', phoneSample: '+1 (416) 555-1234', stripLeadingZero: false,
    privacyLaw: 'PIPEDA', taxLabel: 'GST', defaultTaxRate: 13,
    primaryComms: 'sms',
    paymentMethods: ['Interac e-Transfer', 'Card', 'Bank transfer', 'Cash'],
    industriesFirst: ['Plumber', 'Realtor', 'Mechanic', 'Restaurant', 'Beauty salon', 'Dépanneur', 'Lawyer', 'Dentist'],
    cities: ['Toronto', 'Vancouver', 'Montréal', 'Calgary', 'Ottawa'],
    promptHint: 'Canadian business. Use names like Sarah MacDonald, Michael Tremblay, Priya Singh, Jacob Brown. Reference Toronto/Vancouver/Montréal. Prices in CAD with C$ prefix. Mention PIPEDA for privacy. Acknowledge bilingual context if Quebec.',
    addressHint: 'Street, City Province Postal (e.g. 100 King St W, Toronto ON M5X 1A1)',
    postalLabel: 'Postal code',
  },
  DE: {
    code: 'DE', name: 'Germany', flag: '🇩🇪',
    currencyCode: 'EUR', currencySymbol: '€', symbolPosition: 'after',
    decimal: ',', thousand: '.',
    phoneCountryCode: '49', phoneSample: '+49 30 12345678', stripLeadingZero: true,
    privacyLaw: 'GDPR', taxLabel: 'VAT', defaultTaxRate: 19,
    primaryComms: 'whatsapp',
    paymentMethods: ['SEPA bank transfer', 'EC card', 'Card', 'Cash', 'PayPal'],
    industriesFirst: ['Handwerker', 'Restaurant', 'Friseur', 'KFZ-Werkstatt', 'Anwalt', 'Bäckerei', 'Apotheke', 'Steuerberater'],
    cities: ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln'],
    promptHint: 'German business. Use names like Sarah Müller, Lukas Schmidt, Anna Weber, Felix Becker. Reference Berlin/München/Hamburg. Prices in EUR with € suffix. Use VAT (Mehrwertsteuer). Mention DSGVO/GDPR for privacy. Decimal comma, thousand period.',
    addressHint: 'Straße, PLZ Stadt (z.B. Friedrichstr. 12, 10117 Berlin)',
    postalLabel: 'PLZ',
  },
}

export const COUNTRY_LIST: CountryProfile[] = Object.values(COUNTRIES)

export const DEFAULT_COUNTRY: CountryCode = 'ZA'

/** Format a price string like "1,234.56" or "1.234,56" depending on country */
export function formatMoney(value: number, profile: CountryProfile): string {
  const fixed = value.toFixed(profile.decimal === ',' ? 2 : 2)
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, profile.thousand === '.' ? '.' : profile.thousand === ' ' ? ' ' : ',')
  const number = `${grouped}${profile.decimal}${decPart}`
  return profile.symbolPosition === 'before' ? `${profile.currencySymbol}${number}` : `${number} ${profile.currencySymbol}`
}

/** Convert a phone string to an international tel: link */
export function phoneToTelLink(raw: string, profile: CountryProfile): string {
  if (!raw) return ''
  let digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `tel:${digits}`
  if (profile.stripLeadingZero && digits.startsWith('0')) digits = digits.slice(1)
  return `tel:+${profile.phoneCountryCode}${digits}`
}

/** Convert a phone string to wa.me/<international number> for WhatsApp */
export function phoneToWhatsApp(raw: string, profile: CountryProfile): string {
  if (!raw) return ''
  let digits = raw.replace(/\D/g, '')
  // If it already starts with the country code, leave it.
  if (digits.startsWith(profile.phoneCountryCode)) return digits
  if (profile.stripLeadingZero && digits.startsWith('0')) digits = digits.slice(1)
  return `${profile.phoneCountryCode}${digits}`
}
