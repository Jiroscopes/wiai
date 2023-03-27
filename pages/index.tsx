import Game from '../components/Game';
import React, {forwardRef, useState, useEffect} from 'react';
type HomePageProps = {

}

export default function Home({}: HomePageProps) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const existingLS = localStorage.getItem('wiai');
    if (existingLS) {
      const asJSON = JSON.parse(existingLS);
      // const timestamp = Date.parse(asJSON.timestamp); // Raw timestamp
      const timestamp = new Date(Date.parse(asJSON.timestamp));
      const date = timestamp.getDate();
      const diffDays = (new Date()).getDate() - date;

      // From today
      if (diffDays === 0) {
        window.location.href = `https://${document.location.host}/round/${asJSON.round}`;
        return;
      }
    }

    localStorage.setItem('wiai', JSON.stringify({
      round: 1,
      score: 0,
      timestamp: (new Date()).toISOString()
    }));
    window.location.href = `https://${document.location.host}/round/1`;
  }, []);

  return (
    <>
      {/* <Game /> */}
    </>
  )
}
