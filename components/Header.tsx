import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full py-8 px-6 md:px-10 flex justify-between items-center max-w-screen-xl mx-auto">
      <div className="text-white font-bold text-4xl tracking-tight">Kairos</div>
      <Link 
        href="/signin" 
        className="bg-white text-kairos-primary px-4 py-1.5 rounded-full text-sm font-medium hover:bg-opacity-95 transition-all shadow-sm"
      >
        Sign in
      </Link>
    </header>
  );
};

export default Header;
