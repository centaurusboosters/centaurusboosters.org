import homeStatic from '../data/home.json';
import { getTinaDocument } from '../lib/tina-content';
import HomePage from '../components/next-sections/HomePage';
import FormModal from '../components/next-sections/FormModal';

// getTinaDocument talks to GitHub + Redis live; force this to render per
// request instead of at build time, otherwise `next build` prerenders it
// and those calls run inside the build step itself (slow / rate-limit prone,
// and was timing out the Vercel build).
export const dynamic = 'force-dynamic';

export default async function Home() {
  const tina = await getTinaDocument('page', 'home.json');
  return (
    <div id="top">
      <HomePage tina={tina} staticData={homeStatic} />
      <FormModal />
    </div>
  );
}
