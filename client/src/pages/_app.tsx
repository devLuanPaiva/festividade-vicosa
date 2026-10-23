import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';
import { fontVariableClassNames } from '@/lib/fonts';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <div className={`${fontVariableClassNames} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}
