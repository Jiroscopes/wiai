import React, {forwardRef, useState, useEffect} from 'react';
import Head from 'next/head';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import Cookies from 'cookies';

// My Stuff
import { setRoundCookie, clearCookie, WiaiCookie } from '@/util';

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

export default function Finish({score, reset}: any) {
  
  useEffect(() => {
    if (reset) {
      window.location.href = `https://${document.location.host}/`;
    }
  }, []);
  return (
    <>
    <Head>
      <title>wiai - Which Image Is AI?</title>
      <meta name="description" content="Pick which image is Ai generated. New images daily!" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

    </Head>
      {/* Heading */}
      <div className='heading'>
        <h1 className={`${DHFont.className} text-yellow grid text-7xl`}>wiai</h1>
        <h2 className={`${inter.className} text-gold text-xl`}>Which is AI?</h2>
        <h3 className={`${inter.className} text-gold text-sm`}>(Updated daily)</h3>
      </div>
      <div className="flex items-center justify-center text-yellow mt-24 flex-col">
        <p className='mb-3 text-xl'>Score:</p>
        <div className="score-container">
          <p><sup>{score}</sup>&frasl;<sub>3</sub></p>
        </div>
        <div className="mt-24 text-center">
          <h1>Thank you for playing!</h1>
          <h1>Come back tomorrow for more.</h1>
        </div>
      </div>
    </>
  )
}

// This gets called on every request
export async function getServerSideProps({req, res}: any) {
  const cookies = new Cookies(req, res);
  let wiaiCookie: string = cookies.get('wiai') ?? '';

  if (!wiaiCookie) {
    return {props: {reset: true}};
  }

  const decodedCookie: WiaiCookie = JSON.parse(wiaiCookie);

  // If either piece is missing, reset the cookie and it's data in this request
  if (!decodedCookie.round || decodedCookie.score === undefined || decodedCookie.score === null) {
    clearCookie(req, res, 'wiai');
    return {props: {reset: true}};
  }

  // Pass data to the page via props
  return { props: {score: decodedCookie.score} }
}

