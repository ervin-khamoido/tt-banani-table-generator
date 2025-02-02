'use server';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateId } from 'ai';
import { ReactNode } from 'react';
import { MATERIAL_SYMBOLS } from './lib/constants';
import Table from './components/Table';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(input: string): Promise<ClientMessage> {
  'use server';
  
  const history = getMutableAIState();

  try {
    const result = await streamUI({
      model: openai('gpt-4o-mini'),
      messages: [...history.get(), { role: 'user', content: input }],
      text: ({ content, done }) => {
        if (done) {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            { role: 'assistant', content },
          ]);
        }
        return <div className="text-gray-500">{content}</div>;
      },
      tools: {
        generateTableItems: {
          description: 'Generate table items based on user prompt. Do not ask any additional questions, just generate the table items with dummy data if no actual data is available.',
          parameters: z.object({
            items: z.array(z.object({
              cells: z.array(z.object({
                key: z.string().describe('Key of the column'),
                type: z.enum(['text', 'number', 'date' , 'currency', 'action']).describe('Type of the column'),
                icon: z.string().optional().describe(`Only for main column. Material Symbols icon name. Each row can have unique icon based on the value. Use the icon name from the Material Symbols list: ${MATERIAL_SYMBOLS.join(', ')}`),
                value: z.union([z.string(), z.number()]).describe('Value of the column. Should not repeat the title. Allowed values for actions are: delete, select')
              })).describe('Key-value pairs for columns. Add actions only if user prompt requires it. If actions exists they should be at the end of the array')
            }))
          }),
          generate: async function* ({ items }) {
            yield (
              <div className="animate-pulse p-4 text-gray-500 text-md">Generating table items...</div>
            );

            history.done((messages: ServerMessage[]) => [
              ...messages,
              { role: 'assistant', content: `Generated ${items.length} table items` }
            ]);

            return (
              <Table items={items} />
            );
          }
        }
      }
    });

    return {
      id: generateId(),
      role: 'assistant',
      display: result.value,
    };
  } catch (error) {
    console.error(error);
    return {
      id: generateId(),
      role: 'assistant',
      display: <div className="text-red-500">Error generating table items</div>,
    };
  }
}