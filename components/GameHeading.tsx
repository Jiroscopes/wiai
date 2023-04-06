
import Image from 'next/image';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// My Stuff
import Logo from '../public/logo.svg';

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

export default function GameHeading() {
  return (
    <>
      <div className='heading'>
        <div className='flex flex-row items-center justify-center'>
          <h1 className={`${DHFont.className} text-yellow grid text-7xl`}>wiai</h1>
          <Image className="ml-2" src={Logo} width="60" height="60" alt="logo"/>
        </div>
        <h2 className={`${inter.className} text-gold text-xl`}>Which image is AI?</h2>
        <h3 className={`${inter.className} text-gold text-sm`}>(Updated daily)</h3>
      </div>
    </>
  )
}