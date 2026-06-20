import staticData from '../../data/sponsors.json';
import { getTinaDocument } from '../../lib/tina-content';
import SponsorStripClient from './SponsorStripClient';

export default async function SponsorStrip() {
  const tina = await getTinaDocument('sponsors', 'sponsors.json');
  return <SponsorStripClient tina={tina} staticData={staticData} />;
}
