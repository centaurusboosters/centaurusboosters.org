export const metadata = {
  title: 'Centaurus Warriors Booster Club',
  description: 'Supporting Centaurus High School athletics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
