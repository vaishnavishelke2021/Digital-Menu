import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Digital Menu</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link href="/menu/explore" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                Explore Menus
              </Link>
              <Link href="/#features" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                Features
              </Link>
              <Link href="/#pricing" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                Pricing
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md"
                >
                  Logout
                </button>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <FaUser />
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md">
                  Login
                </Link>
               
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/menu/explore"
              className="block text-gray-600 hover:text-primary px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Menus
            </Link>
            <Link
              href="/#features"
              className="block text-gray-600 hover:text-primary px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="block text-gray-600 hover:text-primary px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-primary px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-primary px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
               
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
