import { createClient } from '@supabase/supabase-js';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import Game from '../../components/Game';
import Cookies from 'cookies';
import { useEffect } from 'react';

type WiaiCookie = {
  round: number,
  score: number
}

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../../fonts/DeliciousHandrawn-Regular.ttf'});

export default function Round({images, quiz, round, score, end}: any) {
  useEffect(() => {
    if (end || !images) {
      window.location.href = `https://${document.location.host}/finish`;
    }
  }, []);

  return (
    <Game images={images} quiz={quiz} round={round} score={score} />
  )
}

// This gets called on every request
export async function getServerSideProps({req, res}: any) {
  const cookies = new Cookies(req, res);
  let wiaiCookie: string = cookies.get('wiai') ?? '';

  if (!wiaiCookie) {
    // Set round cookie, expires at 2am CST (7:00 UTC)
    cookies.set('wiai', JSON.stringify({round: 1, score: 0}), {
      httpOnly: true,
      // secure: true,
      expires: new Date(new Date().setUTCHours(7,0,0,0))
    });

    // Set cookie for this request
    wiaiCookie = JSON.stringify({
      round: 1,
      score: 0
    })
  }

  const decodedCookie: WiaiCookie = JSON.parse(wiaiCookie);

  // If either piece is missing, reset the cookie and it's data in this request
  if (!decodedCookie.round || decodedCookie.score === undefined || decodedCookie.score === null) {
      // Set round cookie, expires at 2am CST (7:00 UTC)
      cookies.set('wiai', JSON.stringify({round: 1, score: 0}), {
        httpOnly: true,
        // secure: true,
        expires: new Date(new Date().setUTCHours(7,0,0,0)),
        overwrite: true
      });

      decodedCookie.round = 1;
      decodedCookie.score = 0;
  }

  // Load current quiz images from the database
  const key: string = process.env.SUPABASE_KEY ?? '';
  const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  // Current time in UTC
  const currentTimestamp: string = new Date().toISOString();
  const {error, data}: any = await supabase.from('quizzes')
    .select(`
      id,
      quiz_rounds (
        images
      )
    `)
    .lte('start_date', currentTimestamp)
    .gte('end_date', currentTimestamp)
    .eq('quiz_rounds.id', decodedCookie.round);
    
  if (!data || data.length === 0) {
    // TODO: if no quiz then set them to the newest one
    return {props: {images: [], quiz: 0, round: 1, score: 0, end: true}}
  }

  if (data[0].quiz_rounds.length === 0) {
    return {props: {images: [], quiz: data[0].id, round: 0, score: 0, end: true}}
  }

  // Pass data to the page via props
  return { props: {images: data[0].quiz_rounds[0].images, quiz: data[0].id, round: decodedCookie.round, score: decodedCookie.score, end: decodedCookie.round > 3} }
}
