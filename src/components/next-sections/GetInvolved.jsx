import staticData from '../../data/get-involved.json';
import { getTinaDocument } from '../../lib/tina-content';
import GetInvolvedClient from './GetInvolvedClient';

export default async function GetInvolved() {
  const tina = await getTinaDocument('get_involved', 'get-involved.json');
  return <GetInvolvedClient tina={tina} staticData={staticData} />;
}
