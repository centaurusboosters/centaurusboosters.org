import staticData from '../../data/tournament.json';
import { getTinaDocument } from '../../lib/tina-content';
import CourseClient from './CourseClient';

export default async function Course() {
  const tina = await getTinaDocument('tournament', 'tournament.json');
  return <CourseClient tina={tina} staticData={staticData} />;
}
