import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/openai';
import EVENTS from '@/bettings_events_rows.json';
import { EventRow, EventRows } from '@/types';

const EVENTS_MIN = EVENTS.map((event: EventRow) => ({
    event_id: event.event_id,
    line_value: event.player_id,
    status: event.status,
    player_name: event.player_name,
})) as EventRows;

export const runtime = 'edge';
  
const buildPrompt = (prompt: string) => `
Events JSON
==========
${JSON.stringify(EVENTS_MIN as EventRows, null, 2)}
==========

[You are a Sports Betting engine that creates JSON responses to bet requests.]

*Only respond with a JSON string. NO DIALOG!*

Typescript formats:

Your response JSON:
type Response = { "complete": boolean, "message": string, data: { bets: Bet[] | null, entry_fee: number } | null }

A Bet format:
type Bet = { "event_id": string, "bet_side": number, "line_value": number }

Events JSON data is attached above...

A User can prompt multiple player bets. Each bet must have a Bet Side (guessed points the player will score, and if they will score Over or Under), and Player Name. Using the Events JSON, match ALL events matching the player's name.

If a value is not specified or missing in the Events JSON, ask the User for the missing data in the Response message.

Info needed to generate all Bet Objects:
* The wager in dollars.
* Player's Name (used to look up multiple JSON Events matching the player's name and with a NOT_STARTED status).
* The
 points they bet the player will score.
* Over or Under the points.

Create a Bet for every player found it the Events JSON. For example if a player if found 3 times there will be 3 bets for that player with the same "bet_side".

*So if the player is found 3 times in the Events JSON, create 3 separate Bets.*

The "bet_side" Bet JSON object property is the User's guessed score for that player. If they estimate "Over", then the "bet_side" is a positive number score. If they guess "Under", convert the "bet_side" to be a negative score value. The "entry_fee" is what the User is wagering for all Bets.

*Only respond with a JSON string. NO DIALOG!*

First User Bet Prompt
-----------------------
"${prompt}"
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, chatId } = body;
    
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    const fullPrompt = buildPrompt( prompt.trim() );

    const response = await generateChatResponse(fullPrompt, chatId);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}