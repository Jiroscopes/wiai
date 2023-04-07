import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'en_IE',
            url: 'https://www.wiai.io/',
            siteName: 'wiai',
            description: 'Pick which image is AI generated. New images daily!',
            images: [
              {
                url: 'https://wiai.io/_next/image?url=%2Fmockup.png&w=1920&q=75&twitter=true',
                width: 1920,
                height: 1080,
                alt: 'Image of Wiai round 1',
                type: 'image/png'
              }
            ]
          }}
          twitter={{
            handle: '@jiroscopes',
            site: '@wiai_io',
            cardType: 'summary_large_image',
          }}
      />
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
