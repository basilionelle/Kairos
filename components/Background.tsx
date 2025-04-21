const Background = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-20">
      {/* Using the KAIROSBG.svg file as the background */}
      <div 
        className="absolute inset-0 w-full h-full bg-kairos-primary"
        style={{
          backgroundImage: 'url(/images/KAIROSBG.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    </div>
  );
};

export default Background;
