const statik = process.env.BUILD_TARGET === 'static'; // dipakai untuk APK (Capacitor)
const backend = process.env.BACKEND_URL || 'http://localhost:8080';

export default statik
  ? { output: 'export' }
  : {
      // Mode web: /api diteruskan ke Spring Boot
      async rewrites() {
        return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
      },
    };
