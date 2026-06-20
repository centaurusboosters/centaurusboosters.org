import staticTournament from '../../data/tournament.json';
import staticContacts from '../../data/contacts.json';
import { getTinaDocument } from '../../lib/tina-content';
import RegisterClient from './RegisterClient';

export default async function Register() {
  const [tinaTournament, tinaContacts] = await Promise.all([
    getTinaDocument('tournament', 'tournament.json'),
    getTinaDocument('contacts', 'contacts.json'),
  ]);
  return (
    <RegisterClient
      tinaTournament={tinaTournament}
      tinaContacts={tinaContacts}
      staticTournament={staticTournament}
      staticContacts={staticContacts}
    />
  );
}
