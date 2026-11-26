export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: 'TemanUMKM',
    short_name: 'TemanUMKM',
    description: 'Hitung modal per porsi dan untung rugi usaha kecil.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e4eaed',
    theme_color: '#1b3358',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
}
