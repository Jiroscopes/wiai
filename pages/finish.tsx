import React, {forwardRef, useState, useEffect} from 'react';
import Head from 'next/head';
// import { createClient } from '@supabase/supabase-js';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import Cookies from 'cookies';

type WiaiCookie = {
  round: number,
  score: number
}

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

export default function Finish({score}: any) {
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
        <h1>Final Score {score}</h1>
        <h1>Thanks for Playing!</h1>
        <h2>Come back tomorrow for more.</h2>
      </div>
    </>
  )
}

// This gets called on every request
export async function getServerSideProps({req, res}: any) {
  const cookies = new Cookies(req, res);
  let wiaiCookie: string = cookies.get('wiai') ?? '';

  if (!wiaiCookie) {
    return {props: {score: 0}}
  }

  const decodedCookie: WiaiCookie = JSON.parse(wiaiCookie);

  // If either piece is missing, reset the cookie and it's data in this request
  if (!decodedCookie.round || decodedCookie.score === undefined || decodedCookie.score === null) {
    return {props: {score: 0}}
  }

  // Load current quiz images from the database
  // const key: string = process.env.SUPABASE_KEY ?? '';
  // const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  // Current time in UTC
  // const currentTimestamp: string = new Date().toISOString();
  // const {error, data}: any = await supabase.from('quizzes')
  //   .select(`
  //     id,
  //     quiz_rounds (
  //       images
  //     )
  //   `)
  //   .lte('start_date', currentTimestamp)
  //   .gte('end_date', currentTimestamp)
  //   .eq('quiz_rounds.id', decodedCookie.round);

  // Pass data to the page via props
  return { props: {score: decodedCookie.score} }
}

