import React, {forwardRef, useState, useEffect} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import { NextSeo } from 'next-seo';

// Fonts
const inter = Inter({ subsets: ['latin'] });
const DHFont = localFont({ src: '../fonts/DeliciousHandrawn-Regular.ttf'});
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
          <div className='heading'>
            <div className='flex flex-row items-center justify-center'>
              <h1 className={`${DHFont.className} text-yellow grid text-7xl`}>wiai</h1>
              <Image className="ml-2" src={Logo} width="60" height="60" alt="logo"/>
            </div>
            <h2 className={`${inter.className} text-gold text-xl`}>Which image is AI?</h2>
            <h3 className={`${inter.className} text-gold text-sm`}>(Updated daily)</h3>
          </div>
        <div className="flex items-center justify-center flex-col">
          <button onClick={startGame} className='home-btns bg-yellow text-darkestBlue'>Start</button>
          {/* <button className='home-btns bg-darkestBlue text-yellow border-2 border-yellow'>How to play?</button> */}
        </div>
      </section>
    </>
  )
}
