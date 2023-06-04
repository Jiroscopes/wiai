import { Inter } from 'next/font/google';
import React, {forwardRef, useState, useEffect} from 'react';
import localFont from 'next/font/local';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Image from 'next/image';

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery'

// My Stuff
import MyImg from '../components/MyImg';
import Logo from '../public/logo.svg';
import { getRoundResult } from '@/util';

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

type GameReviewProps = {
  images: Array<any>,
  quiz: number,
  round: number,
  roundAnswer: string
}

export default function GameReview({ images, round, roundAnswer }: GameReviewProps) {
  const [nextRound, setNextRound] = useState(1);
  const [isLastRound, setIsLastRound] = useState(false);
  const [clientScore, setClientScore] = useState(0);
  const test = getRoundResult(round);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    round = Number(round);
    const roundResults = getRoundResult(round);
    if (roundResults === null) {
      window.location.href = `https://${document.location.host}/`;
      return;
    }

    setClientScore(roundResults.score);
    setNextRound(round + 1);

    if (round === 3) {
      setIsLastRound(true);
    }
  }, []);

  function goNextRound() {
    console.log(`https://${document.location.host}/round/review/${nextRound}`)
    window.location.href = `https://${document.location.host}/round/review/${nextRound}`;
  }

  function goEnd() {
    window.location.href = `https://${document.location.host}/finish`;
  }

  return (
    <>
      <NextSeo 
        title={`wiai - Round ${round} Review`}
        description="Pick which image is AI generated. (No longer updated)"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className=''>
        {/* Main content */}
        <div className='flex items-center flex-col'>
          {/* Heading */}
          <div className='heading'>
            <div className='flex flex-row items-center justify-center'>
              <h1 className={`${DHFont.className} text-yellow grid text-7xl`}>wiai</h1>
              <Image className="ml-2" src={Logo} width="60" height="60" alt="logo"/>
            </div>
            <h2 className={`${inter.className} text-gold text-xl`}>Which image is AI?</h2>
            <h3 className={`${inter.className} text-gold text-sm`}>(No longer updated)</h3>
          </div>
          {/* Game Info */}
          <div className='game-info'>
            <div className='text-darkestBlue'>
              <div className='bg-yellow px-3 py-2 rounded-xl'>
                You Scored: {clientScore}
              </div>
            </div>
            <div className='text-yellow'>
              <p>Reviewing Round {round} / 3</p>
            </div>
          </div>
          {/* Image Grid */}
          <div className='img-grid'>
            <Gallery>
              {images.map((img) => {
                return (                
                  <Item
                    original={`/quiz_images/${img.filename}`}
                    width={img.width ?? '1024'}
                    height={img.height ?? '1024'}
                    key={img.filename}
                >
                  {({ ref, open }) => {
                    // If you got it right, only show the green on your selection
                    if (img.filename === roundAnswer) {
                      return <MyImg imgContainerClass='correct' selectedImg={test?.rounds[round - 1] ?? ''} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                    } else {
                      return <MyImg imgContainerClass='' selectedImg={test?.rounds[round - 1] ?? ''} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                    }                
                  }}
                </Item>
                )
              })}
              </Gallery>
          </div>
          {/* Buttons */}
          <div className='buttons-container'>
            <button className='bg-darkBlue'>Submit</button>
            {!isLastRound && <button onClick={goNextRound} className='bg-yellow'>Next Round 	&gt;</button>}
            {isLastRound && <button onClick={goEnd} className='bg-yellow'>Finish!</button>}                
          </div>
        </div>
      </main>
    </>
  )
}
