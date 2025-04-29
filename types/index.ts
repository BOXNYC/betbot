export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    prompt: string;
    chatId?: string;
}

export interface ChatResponse {
    content: string;
    chatId: string;
}

export type EventRow = {
    event_id: string
    player_id?: string
    stat_type?: string
    league?: string
    result_numeric?: string
    line_value: string
    status: string,
    start_time?: string
    end_time?: string
    total_exposure?: string
    total_over_volume?: string
    total_under_volume?: string
    opponent?: string
    player_name: string
    updated_at?: string
};

export type EventRows = EventRow[];