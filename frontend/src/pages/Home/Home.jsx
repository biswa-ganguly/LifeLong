import React from 'react';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import AIAgent from '../../components/AIAgent';


function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <AIAgent />
    </div>
  );
}

export default Home;