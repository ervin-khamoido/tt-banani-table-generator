'use client';

import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { ClientMessage } from './actions';

export default function Home() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setConversation((current: ClientMessage[]) => [
      ...current,
      { id: generateId(), role: 'user', display: input }
    ]);

    try {
      const message = await continueConversation(input);
      setConversation((current: ClientMessage[]) => [...current, message]);
    } catch (error) {
      console.error(error);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="space-y-4 mb-4">
        {conversation.map((message: ClientMessage) => (
          <div key={message.id} className={`p-4 rounded-lg ${
            message.role === 'user' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-500'
          }`}>
            {message.display}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the table items you want to generate..."
          className="w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-lg 
                   hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 
            <span className="material-symbols-outlined w-5 h-5 animate-spin">sync</span> : 
            <span className="material-symbols-outlined w-5 h-5">arrow_upward</span>
          }
        </button>
      </form>
    </main>
  );
}