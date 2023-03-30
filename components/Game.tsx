import { Inter } from 'next/font/google';
import React, {forwardRef, useState, useEffect} from 'react';
import localFont from 'next/font/local';
import Head from 'next/head';

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery'

// My Components
import MyImg from '../components/MyImg';
// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});

type GameProps = {
  images: Array<any>,
  quiz: number,
  round: number,
  score: number
}

export default function Game({ images, quiz, round, score }: GameProps) {
  const [selectedImg, setSelectedImg] = useState('');
  const [isLastRound, setIsLastRound] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(0); // 0 = Not submitted, 1 = correct submission, 2 = incorrect/invalid submission
  const [answer, setAnswer] = useState('');
  const [nextRound, setNextRound] = useState(1);
  const [clientScore, setClientScore] = useState(0);

  function selectImg(imgName: string) {

    // User can deselect the img
    if (selectedImg && selectedImg === imgName) {
      setSelectedImg('');
      return;
    }
    setSelectedImg(imgName);
  }

  async function submitRound() {
    // TODO: Tell the user to select an image
    if (!selectedImg) {
      return;
    }

    try {
      let res = await fetch('/api/submit', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          round: round,
          quiz: quiz,
          selection: selectedImg
        })
      });

      const data = await res.json();

      if (res.status !== 200) {
        console.log(data.error);
        setNextRound(data.nextRoundFromServer)
        return;
      }
      
      const {correct, answer, nextRoundFromServer, lastRound} = data;
      setAnswer(answer);
      setNextRound(nextRoundFromServer);
      setIsLastRound(lastRound);
  
      if (!correct) {
        setSubmissionStatus(2);
        return;
      }

      setClientScore(score + 1);
      setSubmissionStatus(1);
    } catch (error) {
      console.log('oops')
    }
  }

  function goNextRound() {
    window.location.href = `https://${document.location.host}/round/${nextRound}`;
  }

  function goEnd() {
    window.location.href = `https://${document.location.host}/finish`;
  }

  return (
    <>
      <Head>
        <title>wiai - Which Image Is AI?</title>
        <meta name="description" content="Pick which image is Ai generated. New images daily!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=''>
        {/* Main content */}
        <div className='flex items-center flex-col'>
          {/* Heading */}
          <div className='heading'>
            <h1 className={`${DHFont.className} text-yellow grid text-7xl`}>wiai</h1>
            <h2 className={`${inter.className} text-gold text-xl`}>Which is AI?</h2>
            <h3 className={`${inter.className} text-gold text-sm`}>(Updated daily)</h3>
          </div>
          {/* Game Info */}
          <div className='game-info'>
            <div className='text-darkestBlue'>
              <div className='bg-yellow px-3 py-2 rounded-xl'>
                Score: {Math.max(score, clientScore)}
              </div>
            </div>
            <div className='text-yellow'>
              <p>Round {round}</p>
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
                    if (submissionStatus === 1) {
                      if (img.filename === answer) {
                        return <MyImg imgContainerClass='correct' selectImg={selectImg} selectedImg={selectedImg} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                      } else {
                        return <MyImg imgContainerClass='' selectImg={selectImg} selectedImg={selectedImg} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                      }
                      // if wrong, hightlight the correct answer and the wrong ones
                    } else if (submissionStatus === 2) {
                      if (img.filename === answer) {
                        return <MyImg imgContainerClass='correct' selectImg={selectImg} selectedImg={selectedImg} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                      } else {
                        return <MyImg imgContainerClass='incorrect' selectImg={selectImg} selectedImg={selectedImg} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                      }
                    }else {
                      // No submission yet
                      return <MyImg imgContainerClass='' selectImg={selectImg} selectedImg={selectedImg} filename={img.filename} reff={ref as React.Ref<HTMLImageElement>} open={open} url={`/quiz_images/${img.filename}`} alt={img.alt}/>
                    }
                  }}
                </Item>
                )
              })}
              </Gallery>
          </div>
          {/* Buttons */}
          <div className='buttons-container'>
            {submissionStatus === 0 && (
              <>
                <button onClick={submitRound} className='bg-yellow text-darkestBlue px-10 py-2 rounded-sm mt-3'>Submit</button>
                <button className='bg-darkBlue text-darkestBlue px-10 py-2 rounded-sm mt-3'>Next Round 	&gt;</button>
              </>
            )}
            {submissionStatus > 0 && (
              <>
                <button className='bg-darkBlue'>Submit</button>
                {!isLastRound && <button onClick={goNextRound} className='bg-yellow'>Next Round 	&gt;</button>}
                {isLastRound && <button onClick={goEnd} className='bg-yellow'>Finish!</button>}                
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
