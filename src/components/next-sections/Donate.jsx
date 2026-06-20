import staticData from '../../data/site.json';
import { getTinaDocument } from '../../lib/tina-content';
import DonateClient from './DonateClient';

export default async function Donate() {
  const tina = await getTinaDocument('site', 'site.json');
  return <DonateClient tina={tina} staticData={staticData} />;
}
