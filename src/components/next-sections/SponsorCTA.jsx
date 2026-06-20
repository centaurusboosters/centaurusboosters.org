import staticSite from '../../data/site.json';
import staticBenefits from '../../data/sponsor-benefits.json';
import staticContacts from '../../data/contacts.json';
import { getTinaDocument } from '../../lib/tina-content';
import SponsorCTAClient from './SponsorCTAClient';

export default async function SponsorCTA() {
  const [tinaSite, tinaBenefits, tinaContacts] = await Promise.all([
    getTinaDocument('site', 'site.json'),
    getTinaDocument('sponsor_benefits', 'sponsor-benefits.json'),
    getTinaDocument('contacts', 'contacts.json'),
  ]);
  return (
    <SponsorCTAClient
      tinaSite={tinaSite}
      tinaBenefits={tinaBenefits}
      tinaContacts={tinaContacts}
      staticSite={staticSite}
      staticBenefits={staticBenefits}
      staticContacts={staticContacts}
    />
  );
}
