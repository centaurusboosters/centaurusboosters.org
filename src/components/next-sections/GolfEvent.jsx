import staticData from '../../data/tournament.json';
import { getTinaDocument } from '../../lib/tina-content';
import GolfEventClient from './GolfEventClient';

export default async function GolfEvent() {
  const tina = await getTinaDocument('tournament', 'tournament.json');
  return <GolfEventClient tina={tina} staticData={staticData} />;
}
