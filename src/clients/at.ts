import { AtpAgent } from '@atproto/api';
import axios from 'axios';
import * as sharp from 'sharp';

const url = 'https://api.thecatapi.com/v1/images/';
const apikey = process.env.API_KEY;

async function getCats(url: string): Promise<any> {
  const response = await fetch(`${url}search?api_key=${apikey}&has_breeds=1`);
  if (!response.ok) {
    throw new Error('Forsooth, a scourge upon our fetch quest: ' + response.statusText);
  }
  const catData: any = await response.json();
  return catData;
}

async function loadImageData(cats) {
  const imageUrl = cats[0].url;

  // Read the file from the provided path
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  let buffer = Buffer.from(response.data, 'utf-8');

  // Check file size, 1MB = 1024*1024 bytes
  if (buffer.byteLength > 1024 * 1024) {
    buffer = (await resizeImage(buffer)) as unknown as Buffer<ArrayBuffer>;
  }

  // Convert the buffer to a Uint8Array and return it
  return { data: new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) };
}

async function resizeImage(buffer: Buffer): Promise<Buffer> {
  let newSize = 0.9; // Start with 90% of original size
  let outputBuffer = buffer;
  const image = sharp(buffer);

  const metadata = await image.metadata();

  // We'll try to reduce the image size by 10% in each iteration until the image is under 1MB
  while (outputBuffer.byteLength > 976.56 * 1024) {
    const newWidth = Math.round(metadata.width * newSize);

    outputBuffer = await image
      .rotate() // Correct image rotation based on EXIF data
      .resize(newWidth)
      .jpeg()
      .toBuffer();

    newSize -= 0.1; // Decrease the target size by 10%
  }

  return outputBuffer;
}

async function newFetch(input: RequestInfo | URL, init?: RequestInit) {
  console.log('requesting', input);
  const response = await globalThis.fetch(input, init);
  console.log('got response', response);
  return response;
}

function checkFileExtension(url: string): string {
  return url.substring(url.lastIndexOf('.') + 1).toLowerCase();
}

type PostImageOptions = {
  text: string;
  altText: string;
};
async function postImage({ text, altText }: PostImageOptions) {
  const agent = new AtpAgent({ service: 'https://bsky.social', fetch: newFetch });
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER || 'BSKY_IDENTIFIER missing',
    password: process.env.BSKY_PASSWORD || 'BSKY_PASSWORD missing',
  });
  const cats = await getCats(url);
  const { data } = await loadImageData(cats);
  const testUpload = await agent.uploadBlob(data, { encoding: 'image/' + checkFileExtension(cats[0].url) });
  await agent.post({
    text: text,
    embed: {
      images: [
        {
          image: testUpload.data.blob,
          alt: altText,
        },
      ],
      $type: 'app.bsky.embed.images',
    },
  });
}

export { postImage };
