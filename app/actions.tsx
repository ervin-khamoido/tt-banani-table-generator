import { ReactNode } from 'react';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateId } from 'ai';
import { getMutableAIState, streamUI } from 'ai/rsc';
import { MATERIAL_SYMBOLS } from './lib/constants';
import Table from './components/Table/Table';

// Interfaces for message structures
export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

/**
 * continueConversation is a Next.js Server Action that:
 * 1. Retrieves chat history from mutable AI state.
 * 2. Sends the user's input to an AI model (gpt-4o-mini).
 * 3. Streams the assistant's response.
 * 4. Provides a tool ("generateTableItems") to create table data on demand.
 * 5. Returns a ClientMessage with a component to display the result.
 */
export async function continueConversation(userInput: string): Promise<ClientMessage> {
  'use server'; // Mark this function as a server action (Next.js 13+).

  const aiHistory = getMutableAIState();

  try {
    // Call the AI model and stream its response
    const streamedResult = await streamUI({
      model: openai('gpt-4o-mini'),
      messages: [
        ...aiHistory.get(),
        { role: 'user', content: userInput },
      ],
      // This function is called each time there's a chunk of streamed text.
      text: ({ content, done }) => {
        // When done, update the conversation history with the final assistant response.
        if (done) {
          aiHistory.done((messages: ServerMessage[]) => [
            ...messages,
            { role: 'assistant', content },
          ]);
        }

        return <div className="text-gray-500">{content}</div>;
      },
      // Tools provide specialized functionality that the AI can call upon.
      tools: {
        generateTableItems: {
          description:
            'Generate table items based on user prompt. If no real data is available, use dummy data. Do not ask questions, just generate the items.',
          parameters: z.object({
            items: z.array(
              z.object({
                cells: z.array(
                  z.object({
                    key: z.string().describe('Key of the column'),
                    type: z
                      .enum(['text', 'number', 'date', 'currency', 'action'])
                      .describe('Type of the column'),
                    icon: z
                      .string()
                      .optional()
                      .describe(
                        `Use the icon name from the Material Symbols list: ${MATERIAL_SYMBOLS.join(
                          ', '
                        )}. Only applicable for the main column.`
                      ),
                    value: z
                      .union([z.string(), z.number()])
                      .describe(
                        'Value of the column. For actions, allowed values are "delete" or "select".'
                      ),
                  })
                ).describe(
                  'Key-value pairs for columns. Include "action" types only if the user prompt requires it.'
                ),
              })
            ),
          }),
          // The AI can invoke this tool to generate a table and return it.
          generate: async function* ({ items }) {
            // Show a placeholder while generating table items
            yield (
              <div className="animate-pulse p-4 text-gray-500 text-md">
                Generating table items...
              </div>
            );

            // Once done, store a message in the conversation history
            aiHistory.done((messages: ServerMessage[]) => [
              ...messages,
              { role: 'assistant', content: `Generated ${items.length} table items` },
            ]);

            // Return the actual Table component
            return <Table items={items} />;
          },
        },
      },
    });

    // Return the streamed component wrapped in a ClientMessage
    return {
      id: generateId(),
      role: 'assistant',
      display: streamedResult.value,
    };
  } catch (error) {
    console.error(error);
    // In case of an error, return a basic error display
    return {
      id: generateId(),
      role: 'assistant',
      display: (
        <div className="text-red-500">Error generating table items</div>
      ),
    };
  }
}
