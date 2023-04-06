import React from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

// My Stuff
import GameHeading from '@/components/GameHeading';

export default function Home({}) {
  function startGame() {
    window.location.href = `https://${document.location.host}/round/1`;
  }

  return (
    <>
      <NextSeo 
        title="wiai - Which image is AI?"
        description="Pick which image is AI generated. New images daily!"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <section className="w-screen h-screen flex items-center justify-center flex-col">
        {/* Heading */}
        <GameHeading />
        <div className="flex items-center justify-center flex-col">
          <button onClick={startGame} className='home-btns bg-yellow text-darkestBlue'>Start</button>
          {/* <button className='home-btns bg-darkestBlue text-yellow border-2 border-yellow'>How to play?</button> */}
        </div>
      </section>
    </>
  )
}
