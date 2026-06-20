import staticContacts from '../../data/contacts.json';
import staticTournament from '../../data/tournament.json';
import staticSite from '../../data/site.json';
import { getTinaDocument } from '../../lib/tina-content';
import FooterClient from './FooterClient';

export default async function Footer() {
  const [tinaContacts, tinaTournament, tinaSite] = await Promise.all([
    getTinaDocument('contacts', 'contacts.json'),
    getTinaDocument('tournament', 'tournament.json'),
    getTinaDocument('site', 'site.json'),
  ]);
  return (
    <FooterClient
      tinaContacts={tinaContacts}
      tinaTournament={tinaTournament}
      tinaSite={tinaSite}
      staticContacts={staticContacts}
      staticTournament={staticTournament}
      staticSite={staticSite}
    />
  );
}
