import '../styles/global.css';
import '../styles/components.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Centaurus Warriors Booster Club — Supporting CHS Athletics',
  description:
    'The Centaurus Warriors Booster Club funds gear, travel, grants, and scholarships for every Centaurus High School athletic program. Register for the 2nd Annual Golf Tournament, sponsor, or donate.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
