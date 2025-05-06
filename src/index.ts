import { postImage } from './clients/at';
import { getNextImage } from './images';
import * as dotenv from 'dotenv';
dotenv.config();

interface StoicData {
  author: string;
  quote: string;
}

// EDIT THIS!
function postText(stoicText: string): string {
  return stoicText;
}

// EDIT THIS!
function altText(stoicQuote: string): string {
  return 'Stoic quote: ' + stoicQuote + '. With a cute looking cat.';
}

async function getQuotes(url: string): Promise<StoicData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Forsooth, a scourge upon our fetch quest: ' + response.statusText);
  }
  const stoicData: StoicData = await response.json();
  return stoicData;
}

// Shouldn't have to edit this.
async function main() {
  const stoicInfo = await getQuotes('https://stoic.tekloon.net/stoic-quote');
  const { LAST_IMAGE_NAME: lastImageName } = process.env;
  const nextImage = await getNextImage({ lastImageName });

  console.log(nextImage.imageName);

  await postImage({
    path: nextImage.absolutePath,
    text: postText(stoicInfo.author + ' - ' + '"' + stoicInfo.quote + '"'),
    altText: altText(stoicInfo.author + ' - ' + '"' + stoicInfo.quote + '"'),
  });
}

main();
