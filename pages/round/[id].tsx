import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import Game from '../../components/Game';
// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../../fonts/DeliciousHandrawn-Regular.ttf'});

export default function Round({round, images, quiz, end}: any) {
  const [score, setScore] = useState();
  useEffect(() => {
    let gameInfo: any = localStorage.getItem('wiai');
    if (!gameInfo) {
      localStorage.setItem('wiai', JSON.stringify({
        round: 1,
        score: 0,
        timestamp: (new Date()).toISOString()
      }));

      window.location.href = `https://${document.location.host}/round/1`;
      return;
    }

    gameInfo = JSON.parse(gameInfo);

    if (gameInfo.round != round && !end) {
      window.location.href = `https://${document.location.host}/round/${gameInfo.round}`;
      return;
    }

    setScore(gameInfo.score);
  }, []);

  if (end || !images) {
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

  return (
    <Game images={images} quiz={quiz}/>
  )
}

// This gets called on every request
export async function getServerSideProps(context: any) {
  const round = context.query.id;
  
  if (!round || round < 1) {
    return;
  }

  // Load current quiz images from the database
  const key: any = process.env.SUPABASE_KEY;
  const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  // Current time in UTC
  const currentTimestamp = new Date().toISOString();
  const {error, data} : any = await supabase.from('quizzes')
    .select(`
      id,
      quiz_rounds (
        images
      )
    `)
    .lte('start_date', currentTimestamp)
    .gte('end_date', currentTimestamp)
    .eq('quiz_rounds.id', round);
    
    if (!data || data.length === 0) {
      return {props: {images: [], quiz: 0, end: true}}
    }

    if (data[0].quiz_rounds.length === 0) {
      return {props: {images: [], quiz: data[0].id, end: true}}
    }
  
    if (error) {
      console.error(error)
    }

  // Pass data to the page via props
  return { props: {images: data[0].quiz_rounds[0].images, quiz: data[0].id, end: false, round} }
}
