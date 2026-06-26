import homeStatic from '../data/home.json';
import { getTinaDocument } from '../lib/tina-content';
import HomePage from '../components/next-sections/HomePage';
import FormModal from '../components/next-sections/FormModal';

export default async function Home() {
  const tina = await getTinaDocument('page', 'home.json');
  return (
    <div id="top">
      <HomePage tina={tina} staticData={homeStatic} />
      <FormModal />
    </div>
  );
}
