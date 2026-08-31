import React, { useState } from 'react';

export const RockAndRollChatView: React.FC<{ challenge: any, onComplete: (summary: any) => void }> = ({ challenge, onComplete }) => {
  const [messages, setMessages] = useState<string[]>([]);
  
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 pt-16 flex flex-col">
      <h1 className="text-xl font-bold mb-4">{challenge.title}</h1>
      <div className="flex-1 overflow-y-auto mb-4 bg-zinc-900 p-4 rounded-xl">
        <p className="text-sm text-zinc-400 mb-4 italic">Mission: {challenge.mission}</p>
        {messages.map((m, i) => <p key={i} className="mb-2">{m}</p>)}
      </div>
      <button 
        className="bg-white text-black font-bold py-3 px-6 rounded-xl cursor-pointer"
        onClick={() => onComplete({})}
      >
        Finish Chat & View Summary
      </button>
    </div>
  );
};
