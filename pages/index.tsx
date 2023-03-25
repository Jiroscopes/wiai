import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Head from 'next/head';

// My Components
import MyImg from '../components/MyImg';

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

export default function Home() {
  return (
    <>
      <Head>
        <title>wiai - Which Image Is AI?</title>
        <meta name="description" content="Pick which image is Ai generated. New images daily!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=''>
        {/* Main content */}
        <div className='flex items-center flex-col'>
          {/* Heading */}
          <div className='text-center my-20'>
            <h1 className={`${DHFont.className} text-yellow grid text-6xl`}>wiai</h1>
            <h2 className={`${inter.className} text-gold`}>Which is AI?</h2>
          </div>
          {/* Image Grid */}
          <div className='img-grid'>
            <MyImg url='http://placekitten.com/700/700' alt='' />
            <MyImg url='http://placekitten.com/700/700' alt='' />
            <MyImg url='http://placekitten.com/700/700' alt='' />
            <MyImg url='http://placekitten.com/700/700' alt='' />
          </div>
        </div>
      </main>
    </>
  )
}
