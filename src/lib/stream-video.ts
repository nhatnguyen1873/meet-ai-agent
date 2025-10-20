import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || '';
const secret = process.env.STREAM_SECRET_KEY || '';

if (!apiKey || !secret) {
  throw new Error('Missing env variables for Stream Video API key or secret');
}

export const streamVideo = new StreamClient(apiKey, secret);
