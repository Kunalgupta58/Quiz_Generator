import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing your document...",
  "Identifying key concepts...",
  "Crafting challenging questions...",
  "Building your quiz...",
  "Almost there...",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-700">
        {loadingMessages[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-gray-500">The AI is thinking, this may take a moment...</p>
    </div>
  );
};