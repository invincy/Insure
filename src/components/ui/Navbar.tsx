'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  // Hide navbar on the home page to keep it app-like
  if (pathname === '/') return null;

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 shadow-xl border-b border-blue-600 fixed top-0 left-0 right-0 z-[110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3 group" aria-label="Home">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15V10.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-white">
                  <div className="text-lg font-bold">Insurance</div>
                  <div className="text-xs text-blue-200 font-medium">Insurance Plans • વીમા યોજનાઓ</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
            <Link
              href="/"
              className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 ${
                pathname === '/'
                  ? 'text-white border-b-2 border-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              🏠 હોમ
            </Link>
            <Link
              href="/plans"
              className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 ${
                pathname === '/plans' || pathname.startsWith('/plans/')
                  ? 'text-white border-b-2 border-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              📋 યોજનાઓ
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button className="text-white hover:text-blue-200 focus:outline-none p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;