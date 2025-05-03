import Link from 'next/link';
import { ClientWrapper } from '@/components/ClientWrapper';

export default function NotFound() {
  return (
    <ClientWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="mb-8 opacity-90">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </ClientWrapper>
  );
}
