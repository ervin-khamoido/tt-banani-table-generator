"use client";

import { useCallback, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { ClientMessage } from "./actions";
import { Loader, MessageBubbleList } from "./components";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setConversation((current: ClientMessage[]) => [
      ...current,
      { id: generateId(), role: "user", display: input },
    ]);

    try {
      const message = await continueConversation(input);
      setConversation((current: ClientMessage[]) => [...current, message]);
    } catch (error) {
      console.error(error);
    }

    setInput("");
    setLoading(false);
  }, [ input, setConversation, continueConversation ]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <MessageBubbleList conversation={conversation} />

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
          className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Loader loading={loading} />
        </button>
      </form>
    </main>
  );
}
