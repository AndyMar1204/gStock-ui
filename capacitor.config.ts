import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.andy.gstock',
  appName: 'G-Stock',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
