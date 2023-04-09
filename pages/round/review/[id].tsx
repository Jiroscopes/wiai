import { createClient } from '@supabase/supabase-js';
import Cookies from 'cookies';
import { useEffect } from 'react';

// My Stuff
import GameReview from '@/components/GameReview';

type RoundProps = {
  images: Array<string>,
  quiz: number,
  rounds: number,
  end: boolean,
  answer: string
}

export default function Round({images, quiz, round, end, answer}: any) {
  useEffect(() => {
    if (end || !images) {
      console.log('here')
      window.location.href = `https://${document.location.host}/finish`;
    }
  }, []);

  return (
    <GameReview images={images} quiz={quiz} round={round} roundAnswer={answer}/>
  )
}

// This gets called on every request
export async function getServerSideProps({req, res, params}: any) {

  const round = params.id;

  // Load current quiz images from the database
  const key: string = process.env.SUPABASE_KEY ?? '';
  const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  // Current time in UTC
  const currentTimestamp: string = new Date().toISOString();
  const {error, data}: any = await supabase.from('quizzes')
    .select(`
      id,
      quiz_rounds (
        answer,
        images
      )
    `)
    .lte('start_date', currentTimestamp)
    .gte('end_date', currentTimestamp)
    .eq('quiz_rounds.round', round);
    
  if (!data || data.length === 0) {
    // TODO: if no quiz then set them to the newest one
    return {props: {images: [], quiz: 0, round: 1, score: 0, end: true}}
  }

  if (data[0].quiz_rounds.length === 0) {
    return {props: {images: [], quiz: data[0].id, round: 1, score: 0, end: true}}
  }

  // Pass data to the page via props
  return { props: {answer: data[0].quiz_rounds[0].answer, images: data[0].quiz_rounds[0].images, quiz: data[0].id, round: round,  end: round > 3} }
}