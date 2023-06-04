import React, {useState} from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

// My Stuff
import GameHeading from '@/components/GameHeading';
import QuizCard from '@/components/QuizCard';

export default function All() {
  return (
    <>
      <GameHeading />
      <div className="">
        <QuizCard />
      </div>
    </>
  );
}


