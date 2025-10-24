import 'server-only';

import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY ?? '';
const apiSecret = process.env.STREAM_CHAT_SECRET_KEY ?? '';

if (!apiKey || !apiSecret) {
  throw new Error('Missing env variables for Stream Chat API key or secret');
}

export const streamChat = StreamChat.getInstance(apiKey, apiSecret);
