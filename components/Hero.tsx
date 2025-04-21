import Link from 'next/link';

const Hero = () => {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-center h-[calc(100vh-120px)] px-6 md:px-12 py-0 gap-16 max-w-screen-xl mx-auto -mt-4">
      {/* Left side - App illustration */}
      <div className="w-full xl:w-3/5 relative overflow-visible flex justify-center">
        {/* Main image container with increased size */}
        <div className="relative w-[800px] h-[800px] transform scale-125 md:scale-[1.4] -mt-10">
          <img 
            src="/images/LANDING.svg" 
            alt="Kairos App Interface" 
            className="w-full h-full object-contain animate-float-slow" 
            style={{
              filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.2))',
            }}
          />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/5 w-6 h-6 bg-yellow-300 rounded-full opacity-30"></div>
          <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-white rounded-full opacity-20"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-kairos-accent rounded-full opacity-40"></div>
          <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-white rounded-full opacity-30"></div>
        </div>
      </div>
      
      {/* Right side - Text content with improved hierarchy */}
      <div className="w-full xl:w-2/5 text-white pt-8 xl:pt-0">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
            <span className="block mb-1">The Student-Powered</span>
            <span className="block text-white/95">Toolkit</span>
            <span className="block bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">for College Success</span>
          </h1>
        </div>
        <p className="text-xl md:text-2xl mb-10 text-white/85">
          Explore Kairos Today!
        </p>
        <Link 
          href="/marketplace" 
          className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-all shadow-lg"
        >
          Explore Kairos
        </Link>
      </div>
    </div>
  );
};

export default Hero;
