import { ClientWrapper } from '@/components/ClientWrapper';

const HomePage = () => {
  return (
    <ClientWrapper>
      <HomeContent />
    </ClientWrapper>
  );
};

export default HomePage;

'use client';

import Header from '../components/Header';
import Hero from '../components/Hero';

function HomeContent() {
  return (
    <main 
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/images/KAIROSBG.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#4362d5'
      }}
    >
      <div className="container mx-auto">
        {/* Header with sign in button */}
        <Header />
        
        {/* Hero section with app illustration and text */}
        <Hero />
      </div>
    </main>
  );
}
