import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY || '';
const secret = process.env.STREAM_VIDEO_SECRET_KEY || '';
export const streamVideo = new StreamClient(apiKey, secret);
