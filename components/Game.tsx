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
  quiz: number
}

export default function Game({ images, quiz }: GameProps) {
  const [selectedImg, setSelectedImg] = useState('');
  const [submittedImg, setSubmittedImg] = useState('');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState(0); // 0 = Not submitted, 1 = correct submission, 2 = incorrect/invalid submission
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const existingLS = localStorage.getItem('wiai2');
    if (existingLS) {
      const asJSON = JSON.parse(existingLS);
      // const timestamp = Date.parse(asJSON.timestamp); // Raw timestamp
      const timestamp = new Date(Date.parse(asJSON.timestamp));
      const date = timestamp.getDate();
      const diffDays = (new Date()).getDate() - date;

      // From today
      if (diffDays === 0) {
        setRound(asJSON.round);
        setScore(asJSON.score);
        return;
      }
    }

    localStorage.setItem('wiai2', JSON.stringify({
      round: 1,
      score: 0,
      timestamp: (new Date()).toISOString()
    }));
  }, []);

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

      if (res.status !== 200) {
        console.log('failure');
      }
      const  {correct, answer} = await res.json();
      setSubmittedImg(selectedImg);
      setAnswer(answer);
  
      if (!correct) {
        setSubmissionStatus(2);
        return;
      }

      setScore(score + 1);
      setSubmissionStatus(1);
    } catch (error) {
      console.log('oops')
    }
  }

  function nextRound() {
    let data: any = localStorage.getItem('wiai2');
    if (!data) {
      return;
    }

    data = JSON.parse(data);
    data.score = score;
    data.round += 1;
    localStorage.setItem('wiai2', JSON.stringify(data));
    window.location.href = `https://${document.location.host}/round/${data.round}`;
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
                Score: {score}
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
                    width="1024"
                    height="768"
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
                <button onClick={nextRound} className='bg-yellow'>Next Round 	&gt;</button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
