// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js';
import Cookies from 'cookies';

type Data = {
  nextRoundFromServer: number
  lastRound: boolean
  correct?: boolean,
  answer?: string,
  error?: string
}

type WiaiCookie = {
  round: number,
  score: number
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
    res.status(400).send({ error: 'no cookie', nextRoundFromServer: 1, lastRound: false});
    return;
  }

  const decodedCookie: WiaiCookie = JSON.parse(wiaiCookie);

  // If either piece is missing, reset the cookie and it's data in this request
  if (!decodedCookie.round || decodedCookie.score === undefined || decodedCookie.score === null) {
    res.status(400).send({ error: 'no cookie info', nextRoundFromServer: 1, lastRound: false});
    return;
  }

  const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  const {error, data} : any = await supabase.from('quiz_rounds')
    .select('answer').eq('id', decodedCookie.round).eq('quiz', quiz);

  // TODO: Check how many rounds
  cookies.set('wiai', JSON.stringify({round: decodedCookie.round + 1, score: (data[0]?.answer ?? '') === selection ? decodedCookie.score + 1: decodedCookie.score}), {
    httpOnly: true,
    expires: new Date(new Date().setUTCHours(7,0,0,0)),
    overwrite: true
  });

  if (error) {
    res.status(400).send({ error: 'no info', nextRoundFromServer: 1, lastRound: false});
    return;
  }

  // TODO: replace this when we read how many rounds
  let lastRound = false;
  if (decodedCookie.round + 1 > 3) {
    lastRound = true;
  }

  res.status(200).json({ correct: (data[0]?.answer ?? '') === selection, answer: data[0]?.answer ?? '', nextRoundFromServer: decodedCookie.round + 1, lastRound: lastRound})
}
