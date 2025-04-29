'use client';

import { useCallback, useEffect, useState } from 'react';
import ChatForm from './components/ChatForm';
import LoginForm from './components/LoginForm';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [checkingToken, setCheckingToken] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setCheckingToken(false);
  }, []);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);
  const onLogin = useCallback((token: string) => {
    setTimeout(() => {
      setToken(token);
    }, 2000);
  }, []);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2 text-[#40cf8f]">BetBot</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        What NBA bets would you like to make? Let me know player&apos;s name, point spread, and over/under.
      </p>
      {!checkingToken && <>
        {token && <ChatForm />}
        {!token && <LoginForm onChange={onLogin} />}
        {token && (
          <button
            onClick={handleLogout}
            className="fixed top-0 right-0 py-2 px-4 border-1 border-[#333] text-sm cursor-pointer rounded-xl m-4"
          >
            Logout
          </button>
        )}
      </>}
      {checkingToken && (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-[#40cf8f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </main>
  );
}