import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-JDVXGE8R2W" />
      <Script 
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JDVXGE8R2W');
        `,
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
