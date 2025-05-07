import { postImage } from './clients/at';
require('dotenv').config({ debug: true });
console.log(process.env);

interface StoicData {
  data: { author: string; quote: string };
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
  const stoicData = await response.json();
  return stoicData;
}

// Shouldn't have to edit this.
async function main() {
  const stoicInfo = await getQuotes('https://stoic.tekloon.net/stoic-quote');

  await postImage({
    text: postText(stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"'),
    altText: altText(stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"'),
  });
}

main();
