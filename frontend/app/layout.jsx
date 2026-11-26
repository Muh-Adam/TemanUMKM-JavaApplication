import { Bricolage_Grotesque, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const judul = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-judul' });
const isi = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-isi' });

export const metadata = {
  title: 'TemanUMKM',
  description: 'Hitung modal per porsi, tentukan harga jual, dan cek untung bulanan usaha kecil.',
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${judul.variable} ${isi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
