'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

const isJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export default function ChatForm() {
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a your bet description.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/betbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, chatId }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await res.json();
      setResponse(data.content);
      setChatId(data.chatId); // Store chatId for conversation continuity
      const responseData = isJSON(data.content) ? JSON.parse(data.content) : null;
      if (responseData && responseData.complete) setPrompt(''); // Clear prompt after submission
    } catch (err) {
      setError('Error: Failed to get response');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const responseData = isJSON(response) ? JSON.parse(response) : null;
  const isBetComplete = responseData && responseData.complete;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Place your bet
            <span className="text-red-500 ps-2">*</span>
          </label>
          <input
            type="text"
            id="prompt"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40cf8f]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Place a $10 bet on Steph Curry scoring over 25 points"
          />
          <input type="hidden" id="chatId" value={chatId} />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-[#40cf8f] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900 bg-opacity-50 rounded-md">
          {error}
        </div>
      )}
      
      {responseData && isBetComplete && createPortal(
        <div className="fixed inset-0 backdrop-blur-xl flex flex-col items-center justify-center z-50">
          <div className="bg-[#FFF1] p-6 rounded-md relative">
            <h2 className="text-xl mb-4 text-primary max-w-sm">
              {responseData.message}
            </h2>
            <p className="text-gray-400 mb-2 text-sm">
              Below is your bet code. Use it to create a bet on Strike.
            </p>
            <code className="border-t border-t-white text-[10px] block p-4 whitespace-pre-wrap max-w-2xl max-h-[50vh] overflow-y-auto">
              {JSON.stringify(responseData.data, null, 2)}
            </code>
            <button
              onClick={() => {
                setResponse('');
                setChatId('');
                setPrompt('');
                setError('');
              }} 
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>, document.body
      )}

      {responseData && !isBetComplete && (
        <div className="mt-4 p-3 bg-gray-800 bg-opacity-50 rounded-md flex">
          <div className="text-center mb-2 w-8 mr-4">
            <svg className="w-8 h-8 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 21h22L12 2z" />
              <path d="M12 16c.8 0 1.5.7 1.5 1.5S12.8 19 12 19s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" fill="white" />
              <path d="M12 14c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1z" fill="white" />
            </svg>
          </div>
          <div className="text-white">
            {responseData.message}
          </div>
        </div>
      )}
    </div>
  );
}