import React, {forwardRef, useState, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';
// import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import Cookies from 'cookies';
import { NextSeo } from 'next-seo';
import { TwitterShareButton, TwitterIcon } from 'react-share';

// My Stuff
import GameHeading from '@/components/GameHeading';
import { clearCookie, WiaiCookie } from '@/util';

// Fonts
const inter = Inter({ subsets: ['latin'] });
// const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

export default function Finish({score, reset, roundScores}: any) {
  useEffect(() => {
    if (reset) {
      window.location.href = `https://${document.location.host}/`;
    }
  }, []);
  return (
    <>
    <NextSeo 
        title="wiai - Which image is AI?"
        description="Pick which image is AI generated. (No longer updated)"
    />
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
      <GameHeading />
      <div className="flex items-center justify-center text-yellow mt-20 flex-col">
        <div className="score-container">
          <p><sup>{score}</sup>&frasl;<sub>3</sub></p>
        </div>
        <div className='my-6'>
          {roundScores.map((val: number, idx: number) => {
            return <Link href={`/round/review/${idx + 1}`} className={`${val === 0 ? 'round-wrong' : ''} round-scores`} key={idx}>{val ? '\u2713' : 'X'}</Link>
          })}
        </div>
        <div className={`${inter.className} text-center`}>
          <h1>Thank you for playing!</h1>
          <h1>Come back tomorrow for more.</h1>
          <TwitterShareButton url='https://wiai.io' className='mt-4' related={['@wiai_io']} via='wiai_io' title={`I got ${score}/3 on today's wiai ${score > 1 ? '🥳' : '😭'} \n Rounds: ${roundScores.map((val: number, idx: number) => { return val ? '✅' : '❌'}).join('')}`}>
            <TwitterIcon size={32} round={true}/>
          </TwitterShareButton>
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
  return { props: {score: decodedCookie.score, roundScores: decodedCookie.roundScores ?? []} }
}

