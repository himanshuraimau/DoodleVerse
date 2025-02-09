"use client";
import Link from "next/link";
import { useAuthStore } from '../stores/useAuthStore'

const Home = () => {
  const { isAuthenticated, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            DoodleVerse
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl">
            Create and join collaborative drawing rooms in real-time
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Link
                  href="/create-room"
                  className="px-8 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors text-center min-w-[200px]"
                >
                  Create Room
                </Link>
                <Link
                  href="/join-room"
                  className="px-8 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors text-center min-w-[200px]"
                >
                  Join Room
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-8 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-center min-w-[200px]"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Link
                  href="/signin"
                  className="px-8 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors text-center min-w-[200px]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-3 border border-purple-500 rounded-lg hover:bg-purple-500/10 transition-colors text-center min-w-[200px]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-400 text-center">
            Join our creative community and start collaborating!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
