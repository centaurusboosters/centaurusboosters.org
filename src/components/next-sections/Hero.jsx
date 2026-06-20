import staticTournament from '../../data/tournament.json';
import staticSite from '../../data/site.json';
import { getTinaDocument } from '../../lib/tina-content';
import HeroClient from './HeroClient';

export default async function Hero() {
  const [tinaTournament, tinaSite] = await Promise.all([
    getTinaDocument('tournament', 'tournament.json'),
    getTinaDocument('site', 'site.json'),
  ]);
  return (
    <HeroClient
      tinaTournament={tinaTournament}
      tinaSite={tinaSite}
      staticTournament={staticTournament}
      staticSite={staticSite}
    />
  );
}
