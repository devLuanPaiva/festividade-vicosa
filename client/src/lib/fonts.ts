import { Bebas_Neue, Poppins } from 'next/font/google';
import localFont from 'next/font/local';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
});

export const fortQuinsy = localFont({
  src: '../assets/FONTES/Fort Quinsy/FORTQUINSY.otf',
  variable: '--font-quinsy',
  display: 'swap',
});

export const fontVariableClassNames = [
  poppins.variable,
  bebasNeue.variable,
  fortQuinsy.variable,
].join(' ');
