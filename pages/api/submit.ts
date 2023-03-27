// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js';

type Data = {
  correct: boolean,
  answer: string
}

const key: any = process.env.SUPABASE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {round, selection, quiz} = req.body;
  const supabase = createClient('https://eoylidbwjakonjghnqei.supabase.co', key);

  const {error, data} : any = await supabase.from('quiz_rounds')
    .select('answer').eq('id', round).eq('quiz', quiz)

  if (error) {
    res.status(400);
  }

  res.status(200).json({ correct: (data[0]?.answer ?? '') === selection, answer: data[0]?.answer ?? ''})
}
