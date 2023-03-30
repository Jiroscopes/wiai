// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js';
import Cookies from 'cookies';

// My Stuff
import { setRoundCookie, WiaiCookie } from '@/util';

type Data = {
  nextRoundFromServer: number
  lastRound: boolean
  correct?: boolean,
  answer?: string,
  error?: string
}

const key: any = process.env.SUPABASE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const {selection, quiz} = req.body;
  const cookies = new Cookies(req, res);
  let wiaiCookie: string = cookies.get('wiai') ?? '';

  if (!wiaiCookie) {
    setRoundCookie(req, res, 1, 0, false);
    res.status(400).send({ error: 'no cookie', nextRoundFromServer: 1, lastRound: false});
    return;
  }

  const decodedCookie: WiaiCookie = JSON.parse(wiaiCookie);

    // If either piece is missing, reset the cookie and it's data in this request
  if (!decodedCookie.round || decodedCookie.score === undefined || 
    decodedCookie.score === null || decodedCookie.playDate === undefined || 
    decodedCookie.playDate === null || decodedCookie.playDate === '' || 
    decodedCookie.playDate !== (new Date().toLocaleDateString())
  ) {
      setRoundCookie(req, res, 1, 0, false);
      res.status(400).send({ error: 'no cookie info', nextRoundFromServer: 1, lastRound: false});
      return;
  }

  const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  const {error, data} : any = await supabase.from('quiz_rounds')
    .select('answer').eq('round', decodedCookie.round).eq('quiz', quiz);

  // TODO: Check how many rounds
  const newScore = (data[0]?.answer ?? '') === selection ? decodedCookie.score + 1: decodedCookie.score;

  // Insert score into DB
  const ins: any = await supabase.from('player_scores').insert([{score: newScore}]);

  if (error) {
    res.status(400).send({ error: 'no info', nextRoundFromServer: 1, lastRound: false});
    return;
  }

  // TODO: replace this when we read how many rounds
  let lastRound = false;
  if (decodedCookie.round + 1 > 3) {
    lastRound = true;
  }

  setRoundCookie(req, res, decodedCookie.round + 1, newScore, lastRound);
  res.status(200).json({ correct: (data[0]?.answer ?? '') === selection, answer: data[0]?.answer ?? '', nextRoundFromServer: decodedCookie.round + 1, lastRound: lastRound})
}
