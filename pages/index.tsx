import React, {useState} from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

// My Stuff
import GameHeading from '@/components/GameHeading';
import Instructions from '@/components/Instructions';

export default function Home({}) {
  const [showInstructions, setShowInstructions] = useState(false);

  function startGame() {
    window.location.href = `https://${document.location.host}/round/1`;
  }

  function showInstructionsHandler() {
    setShowInstructions(!showInstructions);
  }

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
      {showInstructions && <Instructions setShowInstructions={setShowInstructions} showInstructions={showInstructions} />}
      
      <section className="w-screen h-screen flex items-center justify-center flex-col">
        {/* Heading */}
        <GameHeading />
        <div className="flex items-center justify-center flex-col">
          <button onClick={startGame} className='home-btns glow bg-yellow text-darkestBlue'>Start</button>
          <button onClick={showInstructionsHandler} className='home-btns hover:text-darkestBlue hover:bg-yellow bg-darkestBlue text-yellow border-2 border-yellow'>How to play</button>
        </div>
      </section>
    </>
  )
}
