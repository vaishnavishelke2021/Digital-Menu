import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const isAdminRoute = router.pathname.startsWith('/admin');
  const isDashboardRoute = router.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">Digital Menu</span>
              </Link>
            </div>

            <div className="flex items-center">
              {user ? (
                <>
                  {!isAdminRoute && !isDashboardRoute && (
                    <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/auth/login')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </Navbar>
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
