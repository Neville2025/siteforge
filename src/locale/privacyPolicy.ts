import type { CountryProfile } from './profiles'

interface PolicyArgs {
  businessName: string
  email: string
  address: string
  country: CountryProfile
}

export function generatePrivacyPolicy({ businessName, email, address, country }: PolicyArgs): string {
  const date = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  const law = country.privacyLaw
  const lawText: Record<typeof law, string> = {
    POPIA:    'the Protection of Personal Information Act, 2013 (POPIA) of South Africa',
    GDPR:     'the General Data Protection Regulation (GDPR) and the relevant Data Protection Act',
    CCPA:     'the California Consumer Privacy Act (CCPA) and applicable US state privacy laws',
    LGPD:     'the Lei Geral de Proteção de Dados (LGPD) of Brazil',
    PIPEDA:   'the Personal Information Protection and Electronic Documents Act (PIPEDA) of Canada',
    PDPA:     'the Digital Personal Data Protection Act (DPDP/PDPA) of India',
    APP:      'the Australian Privacy Principles (APP) under the Privacy Act 1988',
    NDPA:     'the Nigeria Data Protection Act 2023 (NDPA)',
    'DPA-KE': 'the Data Protection Act, 2019 of Kenya',
  }

  const rights: Record<typeof law, string[]> = {
    POPIA:    ['access the personal information we hold about you','request correction or deletion of your information','object to the processing of your information','lodge a complaint with the Information Regulator (South Africa)'],
    GDPR:     ['access the personal data we hold about you','request rectification, erasure or restriction','data portability','object to processing','lodge a complaint with your local data protection authority'],
    CCPA:     ['know what personal information we collect','request deletion of your personal information','opt-out of the sale of your personal information','non-discrimination for exercising your rights'],
    LGPD:     ['access seu cadastro','correção, exclusão, anonimização ou portabilidade dos dados','revogação do consentimento','reclamação perante a Autoridade Nacional de Proteção de Dados (ANPD)'],
    PIPEDA:   ['access the personal information we hold about you','request correction of your information','withdraw consent at any time','file a complaint with the Office of the Privacy Commissioner of Canada'],
    PDPA:     ['access and correction of your personal data','erasure of your data','withdraw consent','grievance redressal via our designated officer'],
    APP:      ['access the personal information we hold about you','correct your information','make a privacy complaint to us or the OAIC'],
    NDPA:     ['access the personal data we hold about you','request rectification or erasure','object to processing','lodge a complaint with the Nigeria Data Protection Commission (NDPC)'],
    'DPA-KE': ['access your personal data','request correction or deletion','object to processing','lodge a complaint with the Office of the Data Protection Commissioner'],
  }

  const safeName = businessName || 'Our Business'
  const safeEmail = email || `privacy@${(businessName||'business').toLowerCase().replace(/[^a-z0-9]+/g,'')}.com`
  const safeAddress = address || country.cities[0]

  // The section's own heading already prints "Privacy Policy" — start the body
  // with the "Last updated" line so we don't get a duplicate H2.
  return `**Last updated:** ${date}

This Privacy Policy explains how **${safeName}** ("we", "us", "our") collects, uses, and protects information about you when you use our website or services. We comply with ${lawText[law]}.

## Information we collect
We may collect:
- Information you give us directly (e.g. name, email address, phone number, message content) when you fill in our contact form, request a quote, or subscribe to communications.
- Technical information automatically when you visit our website (e.g. IP address, browser type, pages visited, referring URL). We use this for analytics and to improve our services.

## How we use your information
We use the information we collect to:
- Respond to your enquiries and provide the services you have requested.
- Send you information about our products, services, and updates (only if you have opted in).
- Improve our website and services.
- Comply with our legal obligations.

## How we share your information
We do not sell your personal information. We may share information with:
- Trusted service providers who help us operate our website and business (e.g. hosting, email delivery), under appropriate confidentiality obligations.
- Authorities where required by law.

## How long we keep your information
We keep personal information only as long as necessary for the purposes described in this policy or as required by law.

## Cookies and similar technologies
Our website uses cookies and similar technologies to operate the site, remember your preferences, and analyse traffic. You can control cookies through your browser settings.

## Your rights
Under ${law}, you have the right to:
${rights[law].map(r => `- ${r}`).join('\n')}

To exercise any of these rights, contact us at the details below.

## Security
We take reasonable technical and organisational measures to protect personal information against loss, misuse, and unauthorised access.

## Contact us
If you have questions about this policy or wish to exercise your rights, contact:

**${safeName}**
${safeAddress ? safeAddress + '\n' : ''}Email: ${safeEmail}
`
}
